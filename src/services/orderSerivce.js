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

const TRACKING = ["Pending", "Processing", "Shipping", "Done", "Cancelled"];
const PAY_TYPE = ["Not Paid", "Deposit"];
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
  static async findOrderByType(type, page, limit) {
    if (type === "All") return await OrderRepository.getOrders({ page, limit });
    return await OrderRepository.getOrdersByType({ type, page, limit });
  }
  static async findOrderByTypeU(account_id, type, page, limit) {
    if (type === "All") {
      const query = {
        account_id: account_id,
        guest: false,
      };
      return await OrderRepository.getOrders({ query, page, limit });
    }
    return await OrderRepository.getOrdersByType({
      account_id,
      type,
      page,
      limit,
    });
  }
  static async removeOrder(order_id) {
    return await OrderRepository.removeOrder(order_id);
  }
  static async createOrder(account_id, order) {
    await verifyProductStockExistence(order);
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
    const newOrder = await OrderRepository.createOrder(account_id, order);
    if (newOrder) {
      const day = new Date().setUTCHours(0, 0, 0, 0);
      const profit = order.order_checkout.final_total;
      await RevenueRepository.updateOrInsert(profit, day);
      await StockUtil.updateStock(order);
    }
    return newOrder;
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
  static async increaseOrderInDistrict(state, district) {
    if (state === TRACKING[4])
      await DistrictService.increaseOrderOfDistrictByName(district);
  }
  static async createOrderGuest(order) {
    await verifyProductStockExistence(order);
    const newOrder = await OrderRepository.createOrderGuest(order);
    if (!newOrder) throw InternalServerError();
    else {
      const day = new Date().setUTCHours(0, 0, 0, 0);
      const profit = order.order_checkout.final_total;
      await RevenueRepository.updateOrInsert(profit, day);
      await StockUtil.updateStock(order);
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
    await OrderTrackingUtil.validatePresentTrackCancel(key_of_type);
    const status = key_of_type === 0 ? 1 : 0;
    const update = {
      name: orderTrackingMap.get(4),
      note: note,
      status: status,
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
    if (foundOrder.order_checkout.paid.must_paid > transaction.amount)
      throw new BadRequestError(
        "Not enough amount of money, must be equal to " +
          foundOrder.order_checkout.paid.must_paid
      );
    if (foundOrder.order_checkout.is_paid)
      throw new BadRequestError("Order was paid");
    transaction.account_id = account_id;
    const transactionCreation = await TransactionRepository.create(transaction);
    if (!transactionCreation)
      throw new InternalServerError("Saving transaction failed!");
    const updatedOrder = await OrderRepository.paid(
      account_id,
      order_id,
      transaction.amount
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

  static async updateSubstateShipping(order_id, name) {
    const foundOrder = await verifyOrderExistence(order_id);
    const newSubstate = { name: name };

    if (foundOrder.current_order_tracking.name != TRACKING[2])
      throw new BadRequestError("Order is not in shipping state");
    const updatedOrder = await OrderRepository.update(order_id, newSubstate);
    return updatedOrder;
  }

  static async categorizePaymentMethod(order) {
    if (
      order.payment_method === "COD" &&
      order.order_checkout.final_total > 1000000
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
}
module.exports = OrderService;
