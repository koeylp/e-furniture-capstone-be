const DeliveryTripRepository = require("../models/repositories/deliveryTripRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const OrderRepository = require("../models/repositories/orderRepository");
const SocketIOService = require("../services/socketIOService");
const NotificationRepository = require("../models/repositories/notificationRepository");
const { default: mongoose } = require("mongoose");
const NotificationEfurnitureService = require("./NotificationEfurnitureService");
class DeliveryTripService {
  static async create(payload) {
    await AccountRepository.findAccountById(payload.account_id);
    await this.verifyOrders(payload.orders);
    await this.modifyDirectTrip();
    const result = await DeliveryTripRepository.createTrip(payload);
    await AccountRepository.updateStateAccount(payload.account_id, 2);
    await NotificationEfurnitureService.notiRequestDeliveryTrip();
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
  static async getDeliveryTripPending() {
    let payload = {
      status: 0,
    };
    return await DeliveryTripRepository.getTrips(payload);
  }
  static async getAllDeliveryTrip() {
    return await DeliveryTripRepository.getTrips();
  }
  static async findTripByAccount(account_id) {
    return await DeliveryTripRepository.findTripByAccount(account_id);
  }
  static async updateTrip(trip_id, order_id, state) {
    const order = await this.findTrip(trip_id);
    await this.updateOrderInsideOrders(order.orders, order_id, state);
    return await this.updateOrders(order);
  }
  static async DoneDeliveryTrip(trip_id) {
    await this.findTrip(trip_id);
    return await this.updateOrdersWithMainStatus(trip_id);
  }
  static async updateOrderInsideOrders(orders, order_id, state) {
    await Promise.all(
      orders.map(async (order) => {
        if (order.order._id.toString() === order_id) {
          order.status = state;
        }
      })
    );
    return orders;
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
  static async checkAllOrderStatus(orders) {
    return orders.every((order) => order.status == 1);
  }
  static async updateDeliveryTripStatus(trip_id, state) {
    const payload = {
      _id: new mongoose.Types.ObjectId(trip_id),
    };
    const update = {
      $set: {
        status: state,
      },
    };
    return await DeliveryTripRepository.updateTrip(payload, update);
  }
  static async confirmDeliveryTrip(trip_id) {
    const result = await this.updateDeliveryTripStatus(trip_id, 1);
    SocketIOService.sendNotifiToDelivery(result.account_id);
    const payload = {
      account_id: result.account_id,
      title: "Confirm Delivery Trip",
      message: "Your Delivery Trip Has Been Confirm By Staff",
      status: 1,
    };
    const noti = await NotificationRepository.create(payload);
    console.log(noti);
    return result;
  }
  static async updateOrdersWithMainStatus(trip_id) {
    return await this.updateDeliveryTripStatus(trip_id, 2);
  }
}
module.exports = DeliveryTripService;
