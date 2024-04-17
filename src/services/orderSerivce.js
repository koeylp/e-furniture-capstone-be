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
const MailtrapService = require("./mailtrapService");
const OrderTrackingUtil = require("../utils/orderTrackingUtils");
const DistrictService = require("./districtService");
const ProductRepository = require("../models/repositories/productRepository");
const WareHouseService = require("./warehouseService");
const BankService = require("./bankService");

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
      result = await OrderRepository.getOrdersByType({
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

    const newOrder = await OrderRepository.createOrder(account_id, order);

    if (newOrder) {
      const day = new Date().setUTCHours(0, 0, 0, 0);
      // const profit = order.order_checkout.final_total;
      // await RevenueRepository.updateOrInsert(profit, day);
    }
    return BankService.createPaymentLink(newOrder);
  }
  // static async updateStock(order) {
  //   const products = order.order_products;
  //   for (const product of products) {
  //     await WareHouseService.updateProductStock();
  //   }
  // }
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
    // await this.increaseOrderInDistrict(
    //   orderTrackingMap.get(key_of_type + 1),
    //   order.order_shipping.district
    // );

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
    order.warehouses = warehouses;
    const newOrder = await OrderRepository.createOrderGuest(order);
    if (!newOrder) throw InternalServerError();
    else {
      // const day = new Date().setUTCHours(0, 0, 0, 0);
      // const profit = order.order_checkout.final_total;
      // await RevenueRepository.updateOrInsert(profit, day);
      // await StockUtil.updateStock(order);
    }
    await MailtrapService.send(newOrder);
    return newOrder;
  }
  static async cancelOrder(account_id, order_id, note) {
    const foundOrder = await verifyOrderExistenceWithUser(account_id, order_id);
    const key_of_type = getKeyByValue(
      orderTrackingMap,
      capitalizeFirstLetter(
        foundOrder.order_tracking[foundOrder.order_tracking.length - 1].name
      )
    );
    // await OrderTrackingUtil.validatePresentTrackCancel(key_of_type);
    // const status = key_of_type === 0 ? 1 : 0;
    const update = {
      name: orderTrackingMap.get(4),
      note: note,
      status: 1,
    };
    const updateTracking = await OrderRepository.updateOrderTracking(
      order_id,
      update,
      {}
    );
    if (
      updateTracking &&
      updateTracking.order_tracking[updateTracking.order_tracking.length - 1]
        .status === 1
    )
      await StockUtil.restoreStock(foundOrder);
    return updateTracking;
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
    transaction.account_id = account_id;
    const transactionCreation = await TransactionRepository.create(transaction);
    if (!transactionCreation)
      throw new InternalServerError("Saving transaction failed!");
    const updatedOrder = await OrderRepository.paid(
      account_id,
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

    const updatedOrder = await OrderRepository.update(
      order_id,
      newSubstate,
      note,
      SUB_STATE[2]
    );

    const substateChecking = await OrderService.checkAndPushFailedState(
      updatedOrder,
      note
    );

    if (!substateChecking) {
      return updatedOrder;
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
    const maxFailureCount = 3;
    const shippingPhase = order.order_tracking.find(
      (phase) => phase.name === shippingPhaseName
    );
    if (!shippingPhase) {
      return;
    }
    let failedCount = 0;
    for (const substate of shippingPhase.substate) {
      if (substate.type === failedSubstateType) {
        failedCount++;
      }
    }
    if (failedCount >= maxFailureCount) {
      order.order_tracking.push({
        name: "Failed",
        status: 1,
        note: note,
      });
    }
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
}
module.exports = OrderService;
