const OrderRepository = require("../models/repositories/orderRepository");
const {
  verifyProductStockExistence,
  verifyOrderExistence,
  verifyOrderExistenceWithUser,
} = require("../utils/verifyExistence");
const { orderTrackingMap } = require("../config/orderTrackingConfig");
const { getKeyByValue } = require("../utils/keyValueUtil");
const { capitalizeFirstLetter } = require("../utils/format");
const {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} = require("../utils/errorHanlder");
const VoucherRepository = require("../models/repositories/voucherRepository");
const RevenueRepository = require("../models/repositories/revenueRepository");
const CartUtils = require("../utils/cartUtils");
const StockUtil = require("../utils/stockUtil");
const TransactionRepository = require("../models/repositories/transactionRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const MailtrapService = require("./mailtrapService");
const OrderTrackingUtil = require("../utils/orderTrackingUtils");
const DistrictService = require("./districtService");
const ProductRepository = require("../models/repositories/productRepository");
const WareHouseService = require("./warehouseService");
const TransactionService = require("./transactionService");
const BankService = require("./bankService");
const ReportService = require("./reportService");
const StateUtils = require("../utils/stateUtils");
const { generateOrderCode } = require("../utils/generateOrderCode");

const TRACKING = ["Pending", "Processing", "Shipping", "Done", "Cancelled"];
const PAY_TYPE = ["Not Paid", "Deposit"];
const SUB_STATE = [0, 1, 2];

class OrderService {
  static async getOrders(page, limit) {
    return await OrderRepository.getOrders({ page, limit });
  }
  static async findOrderDetail(order_id) {
    return await verifyOrderExistence(order_id);
  }
  static async findOrderByUser(account_id, page, limit) {
    return await OrderRepository.getOrdersByUser(account_id, page, limit);
  }
  static async findOrderByType(type, page, limit, status) {
    let result = [];
    if (type === "All") {
      result = await OrderRepository.getOrdersWithoutPopulate({ page, limit });
    } else {
      result = await OrderRepository.getOrdersByTypeWithStatus({
        type,
        page,
        limit,
        status,
      });
    }
    result.data = await Promise.all(
      result.data.map(async (item) => {
        item.order_products = await Promise.all(
          item.order_products.map(async (item) => {
            const modifiedProduct =
              await ProductRepository.findProductByIDWithModify(
                item.product_id.toString()
              );
            item.product_id = modifiedProduct;
            return item;
          })
        );
        return item;
      })
    );
    return result;
  }
  static async findOrderByTypeU(account_id, type, page, limit) {
    let result = [];
    if (type === "All") {
      const query = {
        account_id: account_id,
        guest: false,
      };
      result = await OrderRepository.getOrdersWithoutPopulate({
        query,
        page,
        limit,
      });
    } else {
      result = await OrderRepository.getOrdersByType({
        account_id,
        type,
        page,
        limit,
      });
    }
    result.data = await Promise.all(
      result.data.map(async (item) => {
        item.order_products = await Promise.all(
          item.order_products.map(async (item) => {
            const modifiedProduct =
              await ProductRepository.findProductByIDWithModify(
                item.product_id.toString()
              );
            item.product_id = modifiedProduct;
            return item;
          })
        );
        return item;
      })
    );
    return result;
  }
  static async removeOrder(order_id) {
    return await OrderRepository.removeOrder(order_id);
  }
  static async startCreateOrder() {
    const checkInven = await verifyProductStockExistence(order);
    if (checkInven) {
    }
    return await this.createOrder(account_id, order);
  }
  static async createOrder(account_id, order) {
    const products = await verifyProductStockExistence(order);
    await StockUtil.updateStock(order);

    order = await this.categorizePaymentMethod(order);
    if (order.order_checkout.voucher) {
      const updatedVoucher = await VoucherRepository.save(
        order.order_checkout.voucher
      );
      if (!updatedVoucher)
        throw new ForbiddenError(
          `Voucher ${found_voucher._id} was applied failed`
        );
    }
    for (let product of order.order_products) {
      await CartUtils.removeItem(account_id, product);
    }

    order.order_products = products;
    order.order_code = generateOrderCode();
    if (
      order.payment_method === "COD" &&
      order.order_checkout.final_total < 1000000
    ) {
      var createdOrder = await OrderRepository.createOrder(account_id, order);
    } else {
      const pay_os = await BankService.createPaymentLink(order);
      order.order_checkout.pay_os = {
        orderCode: pay_os.orderCode,
        status: pay_os.status,
        expiredAt: pay_os.expiredAt,
        checkoutUrl: pay_os.checkoutUrl,
      };
      var createdOrder = await OrderRepository.createOrder(account_id, order);
    }

    setTimeout(async () => {
      try {
        await this.checkPaidForCancelling(
          account_id,
          createdOrder._id.toString()
        );
      } catch (error) {
        console.error("Error checking paid for cancelling:", error);
      }
    }, 60 * 1000);
    return createOrder;
  }
  static async updateTracking(order_id, note) {
    const order = await verifyOrderExistence(order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        order.order_tracking[order.order_tracking.length - 1].name
      )
    );
    await OrderTrackingUtil.validatePresentTrackUpdate(key_of_type);
    let updateSet = {};
    if (orderTrackingMap.get(key_of_type + 1) === TRACKING[3]) {
      updateSet = {
        "order_products.$[].status": 1,
        "order_checkout.is_paid": true,
        "order_checkout.paid.paid_amount": order.order_checkout.final_total,
      };
    }

    const updatePush = {
      name: orderTrackingMap.get(key_of_type + 1),
      note: note,
    };
    return await OrderRepository.updateOrderTracking(
      order_id,
      updatePush,
      updateSet
    );
  }
  static async createOrderGuest(order) {
    await verifyProductStockExistence(order);
    order = await this.categorizePaymentMethod(order);
    const warehouses = await StockUtil.updateStock(order);
    order = await this.categorizePaymentMethod(order);
    order.warehouses = warehouses;
    order.order_code = generateOrderCode();

    let newOrder;
    if (
      order.payment_method === "COD" &&
      order.order_checkout.final_total < 1000000
    ) {
      newOrder = await OrderRepository.createOrderGuest(order);
    } else {
      const pay_os = await BankService.createPaymentLink(order);
      order.order_checkout.pay_os = {
        orderCode: pay_os.orderCode,
        status: pay_os.status,
        expiredAt: pay_os.expiredAt,
        checkoutUrl: pay_os.checkoutUrl,
      };
      newOrder = await OrderRepository.createOrderGuest(order);
    }

    await MailtrapService.send(newOrder);
    setTimeout(async () => {
      try {
        await this.checkPaidForCancelling(account_id, newOrder._id.toString());
      } catch (error) {
        console.error("Error checking paid for cancelling:", error);
      }
    });
    return newOrder;
  }

  static async cancelOrder(account_id, order_id, note) {
    let account = await AccountRepository.findAccountById(account_id);
    const foundOrder = await verifyOrderExistenceWithUser(account_id, order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        foundOrder.order_tracking[foundOrder.order_tracking.length - 1].name
      )
    );
    const update = {
      name: orderTrackingMap.get(4),
      note: note.reason,
      status: 1,
    };
    const updateTracking = await OrderRepository.updateOrderTracking(
      order_id,
      update,
      {}
    );
    if (updateTracking) await this.restoreStock(foundOrder);

    if (!foundOrder.order_checkout.is_paid) return updateTracking;

    let payment = foundOrder.payment_method;

    if (payment != StateUtils.PaymentMethod("online"))
      return { update: updateTracking, isReport: false };
    return {
      update: updateTracking,
      note,
      foundOrder,
      account,
      isReport: true,
    };
  }
  static async paid(account_id, transaction) {
    const order_id = transaction.order_id;
    const foundOrder = await OrderRepository.findOrderById({
      account_id,
      order_id,
    });
    if (!foundOrder) throw new NotFoundError("Order not found for this user");
    if (foundOrder.order_checkout.paid.must_paid != transaction.amount)
      throw new BadRequestError(
        "The amount of money must be equal to " +
          foundOrder.order_checkout.paid.must_paid
      );
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        foundOrder.order_tracking[foundOrder.order_tracking.length - 1].name
      )
    );
    await OrderTrackingUtil.validatePendingTrackUpdate(key_of_type);
    if (foundOrder.order_checkout.is_paid)
      throw new BadRequestError("Order was paid");

    const transactionCreation = await TransactionService.createPaidTransaction(
      account_id,
      transaction,
      foundOrder.order_code
    );

    if (!transactionCreation)
      throw new InternalServerError("Saving transaction failed!");
    const updatedOrder = await OrderRepository.paid(
      account_id,
      order_id,
      Math.floor(transaction.amount)
    );
    return updatedOrder;
  }

  static async paidGuest(transaction) {
    const order_id = transaction.order_id;
    const foundOrder = await OrderRepository.findOrderById({
      order_id,
    });
    if (!foundOrder) throw new NotFoundError("Order not found for this user");
    if (foundOrder.order_checkout.paid.must_paid != transaction.amount)
      throw new BadRequestError(
        "The amount of money must be equal to " +
          foundOrder.order_checkout.paid.must_paid
      );
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        foundOrder.order_tracking[foundOrder.order_tracking.length - 1].name
      )
    );
    await OrderTrackingUtil.validatePendingTrackUpdate(key_of_type);
    if (foundOrder.order_checkout.is_paid)
      throw new BadRequestError("Order was paid");

    // const transactionCreation = await TransactionService.createPaidTransaction(
    //   account_id,
    //   transaction,
    //   foundOrder.order_code
    // );

    // if (!transactionCreation)
    //   throw new InternalServerError("Saving transaction failed!");
    const updatedOrder = await OrderRepository.paid(
      null,
      order_id,
      Math.floor(transaction.amount)
    );
    return updatedOrder;
  }

  static async acceptCancel(order_id) {
    const order = await verifyOrderExistence(order_id);
    if (
      order.order_tracking[order.order_tracking.length - 1].status === 1 &&
      order.order_tracking[order.order_tracking.length - 1].name === TRACKING[4]
    )
      throw new BadRequestError("Order's cancel was accepted");
    const acceptedCancel = await OrderRepository.acceptCancel(order_id);
    if (acceptedCancel) {
      const day = new Date().setUTCHours(0, 0, 0, 0);
      const profit = order.order_checkout.final_total;
      await RevenueRepository.updateOrInsert(-profit, day);
    }
    return acceptedCancel;
  }

  static async getCancelRequests() {
    const query = {
      status: 1,
      $expr: {
        $and: [
          {
            $eq: [{ $arrayElemAt: ["$order_tracking.name", -1] }, TRACKING[4]],
          },
          { $eq: [{ $arrayElemAt: ["$order_tracking.status", -1] }, 0] },
        ],
      },
    };
    return await OrderRepository.getOrders({ query });
  }

  static async updateSubstateShipping(order_id, note) {
    let newSubstate = {
      name: note,
    };
    const foundOrder = await verifyOrderExistence(order_id);
    if (foundOrder.current_order_tracking.name != TRACKING[2])
      throw new BadRequestError("Order is not in shipping state");

    const substateChecking = await OrderService.checkAndPushFailedState(
      foundOrder,
      note
    );

    if (!substateChecking) {
      return foundOrder;
    } else {
      return substateChecking;
    }
  }

  static async categorizePaymentMethod(order) {
    if (
      order.payment_method === "COD" &&
      order.order_checkout.final_total >= 1000000
    ) {
      order.order_checkout.paid = {
        type: PAY_TYPE[1],
        must_paid: order.order_checkout.final_total * 0.1,
      };
    } else {
      order.order_checkout.paid = {
        must_paid: order.order_checkout.final_total,
      };
    }
    return order;
  }

  static async checkAndPushFailedState(order, note) {
    const shippingPhaseName = "Shipping";
    const failedSubstateType = "Failed";
    // const maxFailureCount = 3;
    // const shippingPhase = order.order_tracking.find(
    //   (phase) => phase.name === shippingPhaseName
    // );
    // if (!shippingPhase) {
    //   return;
    // }
    // let failedCount = 0;
    // for (const substate of shippingPhase.substate) {
    //   if (substate.type === failedSubstateType) {
    //     failedCount++;
    //   }
    // }
    // if (failedCount >= maxFailureCount) {
    order.order_tracking.push({
      name: "Failed",
      status: 1,
      note: note,
    });
    // }
    return await OrderRepository.updateOrder(order);
  }
  static async doneShipping(order_id, note) {
    const order = await verifyOrderExistence(order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        order.order_tracking[order.order_tracking.length - 1].name
      )
    );
    await OrderTrackingUtil.validateDoneTrackUpdate(key_of_type);
    const update = {
      name: orderTrackingMap.get(3),
      note: note,
    };
    // await this.increaseOrderInDistrict(order.order_shipping.district);
    return await OrderRepository.updateOrderTracking(order_id, update, {});
  }

  static async refundOrder(code, note) {
    const order = await OrderRepository.findOrderByOrderCode(code);
    if (!order) throw new BadRequestError();
    const update = {
      name: orderTrackingMap.get(5),
      note: note,
    };
    return await OrderRepository.updateOrderTracking(
      order._id.toString(),
      update,
      {}
    );
  }

  static async increaseOrderInDistrict(district) {
    await DistrictService.increaseOrderOfDistrictByName(district);
  }

  static async processingToShiping(order_id) {
    const order = await verifyOrderExistence(order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        order.order_tracking[order.order_tracking.length - 1].name
      )
    );
    if (key_of_type == 2) return;
    await OrderTrackingUtil.validateProcessingTrackUpdate(key_of_type);
    const update = {
      name: orderTrackingMap.get(2),
      note: "Your Order Is On Its Way",
    };
    return await OrderRepository.updateOrderTracking(order_id, update, {});
  }

  static async failedToShiping(order_id) {
    let { count, order } = await OrderRepository.calculateStateOfOrder(
      order_id,
      "Failed"
    );
    if (count >= 2) {
      await this.restoreStock(order);
      return;
    }
    const update = {
      name: orderTrackingMap.get(2),
      note: "Your Order Is On Its Way",
      status: 2,
    };
    return await OrderRepository.updateOrderTracking(order_id, update, {});
  }

  static async restoreStock(order) {
    const products = order.order_products;
    for (const product of products) {
      await StockUtil.restoreInventoryStock(product);
      await WareHouseService.decreaseProductSold(product, product.quantity);
      await WareHouseService.increaseProductStock(product, product.quantity);
    }
  }

  static async payPayOS(account_id, orderCode) {
    const query = {
      "order_checkout.pay_os.orderCode": parseInt(orderCode),
    };
    const transaction = await BankService.getPaymentLinkInfomation(orderCode);
    if (transaction.status === "PAID") {
      var foundOrder = await OrderRepository.findOrder(query);
      if (!foundOrder.order_checkout.is_paid) {
        let db_transaction = {
          order_id: foundOrder._id,
          amount: transaction.amountPaid,
          description: transaction.transactions[0].description,
          when: transaction.createdAt,
        };
        return await this.paid(account_id, db_transaction);
      }
    }
    return foundOrder;
  }

  static async payPayOSGuest(orderCode) {
    const query = {
      "order_checkout.pay_os.orderCode": parseInt(orderCode),
    };
    const transaction = await BankService.getPaymentLinkInfomation(orderCode);
    if (transaction.status === "PAID") {
      var foundOrder = await OrderRepository.findOrder(query);
      if (!foundOrder.order_checkout.is_paid) {
        let db_transaction = {
          order_id: foundOrder._id,
          amount: transaction.amountPaid,
          description: transaction.transactions[0].description,
          when: transaction.createdAt,
        };
        return await this.paidGuest(db_transaction);
      }
    }
    return foundOrder;
  }

  static async updateProductItemState(order_code, product_id, state) {
    let order = await OrderRepository.findOrderByOrderCode(order_code);
    const matchingProduct = order.order_products.find(
      (product) => product.product_id._id.toString() == product_id.toString()
    );

    if (matchingProduct) {
      matchingProduct.status = state;
    }
    return await OrderRepository.updateOrder(order);
  }
  static async payAgain(order_id) {
    const order = await verifyOrderExistence(order_id);
    const pay_os = await BankService.createPaymentLink(order);
    order.order_checkout.pay_os = {
      orderCode: pay_os.orderCode,
      status: pay_os.status,
      expiredAt: pay_os.expiredAt,
      checkoutUrl: pay_os.checkoutUrl,
    };
    await OrderRepository.updateOrder(order);
    return pay_os.checkoutUrl;
  }
  static async checkPaidForCancelling(account_id, order_id) {
    const foundOrder = await verifyOrderExistence(order_id);
    const note = "Your order was not paid in 24 hours";
    console.log(note);
    if (!foundOrder.order_checkout.is_paid)
      await this.cancelOrder(account_id, order_id, note);
  }
}
module.exports = OrderService;
