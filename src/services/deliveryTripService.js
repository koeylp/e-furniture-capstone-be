const DeliveryTripRepository = require("../models/repositories/deliveryTripRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const OrderRepository = require("../models/repositories/orderRepository");
const { default: mongoose } = require("mongoose");
class DeliveryTripService {
  static async create(payload) {
    await AccountRepository.findAccountById(payload.account_id);
    await this.verifyOrders(payload.orders);
    await this.modifyDirectTrip();
    const result = await DeliveryTripRepository.createTrip(payload);
    await AccountRepository.updateStateAccount(payload.account_id, 2);
    return result;
  }
  static async modifyDirectTrip() {}
  static async verifyOrders(orders) {
    await Promise.all(
      orders.map(async (order) => {
        await OrderRepository.findOrderById({ order_id: order.order });
      })
    );
  }
  static async findTrip(trip_id) {
    return await DeliveryTripRepository.findTripById(trip_id);
  }
  static async updateTrip(trip_id, order_id) {
    const order = await this.findTrip(trip_id);
    await this.updateOrderInsideOrders(order.orders, order_id);
    if (await this.checkAllOrderStatus(order.orders)) {
      await AccountRepository.updateStateAccount(payload.account_id, 1);
      return await this.updateOrdersWithMainStatus(order);
    }
    return await this.updateOrders(order);
  }
  static async updateOrderInsideOrders(orders, order_id) {
    await Promise.all(
      orders.map(async (order) => {
        if (order.order._id.toString() === order_id) {
          order.status = 1;
        }
      })
    );
    return orders;
  }
  static async checkAllOrderStatus(orders) {
    return orders.every((order) => order.status == 1);
  }
  static async updateOrders(order) {
    const payload = {
      _id: new mongoose.Types.ObjectId(order._id),
    };
    const update = {
      $set: {
        orders: order.orders,
      },
    };
    return await DeliveryTripRepository.updateTrip(payload, update);
  }
  static async updateOrdersWithMainStatus(order) {
    const payload = {
      _id: new mongoose.Types.ObjectId(order._id),
    };
    const update = {
      $set: {
        orders: order.orders,
        status: 1,
      },
    };
    return await DeliveryTripRepository.updateTrip(payload, update);
  }
}
module.exports = DeliveryTripService;
