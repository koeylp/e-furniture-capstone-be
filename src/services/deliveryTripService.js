const DeliveryTripRepository = require("../models/repositories/deliveryTripRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const OrderRepository = require("../models/repositories/orderRepository");
const SocketIOService = require("../services/socketIOService");
const NotificationRepository = require("../models/repositories/notificationRepository");
const { default: mongoose } = require("mongoose");
const NotificationEfurnitureService = require("./NotificationEfurnitureService");
const { BadRequestError, NotFoundError } = require("../utils/errorHanlder");
const OrderService = require("./orderSerivce");
const DeliveryTripUtils = require("../utils/deliveryTripUtils");
const StateUtils = require("../utils/stateUtils");
class DeliveryTripService {
  static async create(payload) {
    const [accountData, orderState, modifiedDirectTrip] = await Promise.all([
      AccountRepository.findAccountById(payload.account_id),
      this.verifyOrders(payload.orders),
      this.modifyDirectTrip(),
    ]);
    if (accountData.status === 2)
      throw new BadRequestError(
        "Cannot Create Another Request! Waiting For Staff"
      );

    payload.orders = await this.moddifyOrderInsideDelivertTrip(payload.orders);

    const result = await DeliveryTripRepository.createTrip(payload);

    payload.orders.forEach(async (order) => {
      if (!orderState[order.order])
        throw new NotFoundError("Error With Order Choosen!");

      let stateValue =
        StateUtils.OrderState(orderState[order.order]) ==
        StateUtils.OrderState("Shipping")
          ? StateUtils.ShippingState("Processing")
          : StateUtils.ProcessingState("Processing");

      await OrderRepository.updateSubStateInsideOrderTracking(
        order.order,
        StateUtils.OrderState(orderState[order.order]),
        stateValue
      );
    });

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
      order.amount = dataOrder.order_checkout.paid.must_paid;
    });

    await Promise.all(orderPromise);

    return orders;
  }

  static async verifyOrders(orders) {
    const orderState = {};
    await Promise.all(
      orders.map(async (order) => {
        let result = await OrderRepository.findOrderById({
          order_id: order.order,
        });
        if (!orderState[result._id])
          orderState[result._id] = result.current_order_tracking.name;
      })
    );
    return orderState;
  }

  static async findTrip(trip_id) {
    return await DeliveryTripRepository.findTripByIdWithoutPopulate(trip_id);
  }

  static async findTripById(trip_id) {
    let result = await DeliveryTripRepository.findTripById(trip_id);
    let current = await DeliveryTripUtils.getCurrentTrip(result);
    if (current !== -1) return { ...result, current_delivery: current };
    result.status = 1;
    return result;
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
    let result = await DeliveryTripRepository.findTripByAccount(account_id);
    let current = await DeliveryTripUtils.getCurrentTrip(result);
    if (current !== -1) return { ...result, current_delivery: current };
    result.status = 1;
    return result;
  }

  static async updateTrip(trip_id, order_id, state, note) {
    const order = await this.findTrip(trip_id);
    await this.updateOrderInsideOrders(order.orders, order_id, state, note);
    return await this.updateOrders(order);
  }

  static async DoneDeliveryTrip(trip_id) {
    const { account, deliveryTrip } = await this.getAccountInDeliveryTrip(
      trip_id
    );
    const accountResult = await AccountRepository.updateStateAccount(
      account._id,
      1
    );
    const payload = {
      account_id: account._id,
      title: "Done Delivery Trip",
      message: "Your Delivery Trip Has Been Done",
      status: 1,
    };
    await this.SendNotification(payload, accountResult.status);
    return await this.updateOrdersWithMainStatus(trip_id);
  }

  static async updateOrderInsideOrders(orders, order_id, state, note) {
    await Promise.all(
      orders.map(async (order) => {
        if (order.order.toString() === order_id) {
          order.status = state;
          if (state == 1) {
            await OrderService.doneShipping(order_id, note);
          } else {
            await OrderService.updateSubstateShipping(order_id, note);
          }
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

    const result = await this.updateDeliveryTripStatus(
      trip_id,
      StateUtils.DeliveryTripState("Processing")
    );

    deliveryTrip.orders.forEach(
      async (order) => await OrderService.processingToShiping(order.order)
    );
    const accountResult = await AccountRepository.updateStateAccount(
      account._id,
      3
    );
    const payload = {
      account_id: result.account_id,
      title: "Confirm Delivery Trip",
      message: "Your Delivery Trip Has Been Confirm By Staff",
      status: 1,
    };
    await this.SendNotification(payload, accountResult.status);
    return result;
  }

  static async SendNotification(payload, state) {
    SocketIOService.sendNotifiToDelivery(payload.account_id, state);
    await NotificationRepository.create(payload);
  }

  static async updateOrdersWithMainStatus(trip_id) {
    return await this.updateDeliveryTripStatus(
      trip_id,
      StateUtils.DeliveryTripState("Done")
    );
  }

  static async rejectDeliveryTrip(trip_id, note) {
    const { account, deliveryTrip } = await this.getAccountInDeliveryTrip(
      trip_id
    );
    if (account.status === 3)
      throw new BadRequestError("Delivery Is On The Trip!");

    let orderState = await this.verifyOrders(deliveryTrip.orders);

    deliveryTrip.orders.forEach(async (order) => {
      if (!orderState[order.order])
        throw new NotFoundError("Error With Order State!");

      let stateValue =
        StateUtils.OrderState(orderState[order.order]) ==
        StateUtils.OrderState("Shipping")
          ? StateUtils.ShippingState("Waiting")
          : StateUtils.ProcessingState("Waiting");

      await OrderRepository.updateSubStateInsideOrderTracking(
        order.order,
        StateUtils.OrderState(orderState[order.order]),
        stateValue
      );
    });

    const accountResult = await AccountRepository.updateStateAccount(
      account._id,
      1
    );

    let result = await this.updateDeliveryTripStatus(
      trip_id,
      StateUtils.DeliveryTripState("Reject")
    );

    const payload = {
      account_id: account._id,
      title: "Reject Delivery Trip",
      message: note,
      status: 1,
    };
    await this.SendNotification(payload, accountResult.status);

    return result;
  }
}
module.exports = DeliveryTripService;
