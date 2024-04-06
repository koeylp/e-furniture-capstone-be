const DeliveryTripRepository = require("../models/repositories/deliveryTripRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const OrderRepository = require("../models/repositories/orderRepository");
const SocketIOService = require("../services/socketIOService");
const NotificationRepository = require("../models/repositories/notificationRepository");
const { default: mongoose } = require("mongoose");
const NotificationEfurnitureService = require("./NotificationEfurnitureService");
const { BadRequestError } = require("../utils/errorHanlder");
const OrderService = require("./orderSerivce");
class DeliveryTripService {
  static async create(payload) {
    await Promise.all([
      AccountRepository.findAccountById(payload.account_id),
      this.verifyOrders(payload.orders),
      this.modifyDirectTrip(),
    ]);

    payload.orders = await this.moddifyOrderInsideDelivertTrip(payload.orders);

    const result = await DeliveryTripRepository.createTrip(payload);
    payload.orders.forEach(
      async (order) =>
        await OrderRepository.updateSubStateInsideOrderTracking(
          order.order,
          "Processing",
          2
        )
    );

    await Promise.all([
      AccountRepository.updateStateAccount(payload.account_id, 2),
      NotificationEfurnitureService.notiRequestDeliveryTrip(),
    ]);
    return result;
  }

  static async modifyDirectTrip() {}

  static async moddifyOrderInsideDelivertTrip(orders) {
    const orderPromise = orders.map(async (order) => {
      const dataOrder = await OrderRepository.findOrderById({
        order_id: order.order,
      });
      order.payment = dataOrder.payment_method;
      order.amount =
        dataOrder.order_checkout.final_total -
        dataOrder.order_checkout.paid.must_paid;
    });
    await Promise.all(orderPromise);
    return orders;
  }

  static async verifyOrders(orders) {
    await Promise.all(
      orders.map(async (order) => {
        await OrderRepository.findOrderById({ order_id: order.order });
      })
    );
  }

  static async findTrip(trip_id) {
    return await DeliveryTripRepository.findTripByIdWithoutPopulate(trip_id);
  }

  static async findTripById(trip_id) {
    return await DeliveryTripRepository.findTripById(trip_id);
  }

  static async getDeliveryTripPending() {
    let payload = {
      status: 0,
    };
    return await DeliveryTripRepository.getTrips(payload);
  }

  static async getAccountInDeliveryTrip(trip_id) {
    const trip = await this.findTrip(trip_id);
    const checkAccount = await AccountRepository.findAccountById(
      trip.account_id
    );
    return { account: checkAccount, deliveryTrip: trip };
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
    const { account, deliveryTrip } = await this.getAccountInDeliveryTrip(
      trip_id
    );
    await AccountRepository.updateStateAccount(account._id, 1);
    const payload = {
      account_id: account._id,
      title: "Done Delivery Trip",
      message: "Your Delivery Trip Has Been Done",
      status: 1,
    };
    await this.SendNotification(payload);
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
    const { account, deliveryTrip } = await this.getAccountInDeliveryTrip(
      trip_id
    );
    if (account.status === 3)
      throw new BadRequestError("Delivery Is On Another Trip!");
    const result = await this.updateDeliveryTripStatus(trip_id, 1);
    deliveryTrip.orders.forEach(
      async (order) => await OrderService.processingToShiping(order.order)
    );
    await AccountRepository.updateStateAccount(account._id, 3);
    const payload = {
      account_id: result.account_id,
      title: "Confirm Delivery Trip",
      message: "Your Delivery Trip Has Been Confirm By Staff",
      status: 2,
    };
    await this.SendNotification(payload);
    return result;
  }

  static async SendNotification(payload) {
    SocketIOService.sendNotifiToDelivery(payload.account_id);
    await NotificationRepository.create(payload);
  }

  static async updateOrdersWithMainStatus(trip_id) {
    return await this.updateDeliveryTripStatus(trip_id, 2);
  }
}
module.exports = DeliveryTripService;
