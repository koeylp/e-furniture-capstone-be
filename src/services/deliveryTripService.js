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
const WareHouseRepository = require("../models/repositories/warehouseRepository");
const RevenueService = require("./revenueService");
const { findOptimalRoute } = require("../utils/deliveryRouteOptimizer");

class DeliveryTripService {
  static async create(payload) {
    const [accountData, { orderState, orders }] = await Promise.all([
      AccountRepository.findAccountById(payload.account_id),
      this.modifyOrders(payload.orders),
    ]);
    if (accountData.status === StateUtils.AccountState("Shipping"))
      throw new BadRequestError(
        "Cannot Assign To Delivery! Waiting For Shipping"
      );
    await Promise.all(
      orders.map(
        async (order) => await OrderService.processingToShiping(order.order)
      )
    );
    payload.orders = orders;
    payload.current_state = {
      item: StateUtils.DeliveryTripState("PickUpPackage"),
      state: StateUtils.DeliveryTripStateValue("PickUpPackage"),
      stateValue: StateUtils.DeliveryTripState("PickUpPackage"),
    };
    payload.state = [payload.current_state];
    const warehouse = await WareHouseRepository.findFirst();
    payload.warehouse = {
      province: warehouse.province,
      district: warehouse.district,
      ward: warehouse.ward,
      longitude: warehouse.longitude,
      latitude: warehouse.latitude,
      location: warehouse.location,
    };
    const result = await DeliveryTripRepository.createTrip(payload);

    await Promise.all([
      this.updateSubState(payload, orderState, "Processing"),
      AccountRepository.updateStateAccount(
        payload.account_id,
        StateUtils.AccountState("Shipping")
      ),
      NotificationEfurnitureService.notiRequestDeliveryTrip(
        `${accountData.first_name} ${accountData.last_name}`
      ),
    ]);
    const payloadNoti = {
      account_id: accountData._id,
      title: "Assign Delivery Trip",
      message: "Delivery Trip Has Been Assign",
      status: 1,
    };

    await this.SendNotification(payloadNoti, 2);
    return result;
  }

  /*  static async modifyOrders(orders) {
    const orderState = {};
    const orderPromise = orders.map(async (order) => {
      let result = await OrderRepository.findOrderById({
        order_id: order.order,
      });
      order.payment = result.payment_method;
      order.amount = result.order_checkout.final_total;
      if (!orderState[result._id])
        orderState[result._id] = result.current_order_tracking.name;
    });
    await Promise.all(orderPromise);
    return { orderState, orders };
  } */

  static async modifyOrders(orders) {
    const orderState = {};
    const tspSortedOrders = await findOptimalRoute(orders);
    const orderPromises = tspSortedOrders.map(async (order) => {
      let result = await OrderRepository.findOrderById({
        order_id: order.order,
      });
      order.payment = result.payment_method;
      order.amount = result.order_checkout.final_total;
      if (!orderState[result._id])
        orderState[result._id] = result.current_order_tracking.name;
      return order;
    });
    const modifiedOrders = await Promise.all(orderPromises);
    return { orderState, orders: modifiedOrders };
  }

  static async findTrip(trip_id) {
    return await DeliveryTripRepository.findTripByIdWithoutPopulate(trip_id);
  }

  static async findTripById(trip_id) {
    let result = await DeliveryTripRepository.findTripById(trip_id);
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
    return result;
  }

  static async updateTrip(trip_id, order_id, state, note) {
    const order = await this.findTrip(trip_id);
    if (
      order.current_state.stateValue !==
      StateUtils.DeliveryTripState("Shipping")
    )
      throw new BadRequestError("You Cannot Confirm The Journey!");
    await this.updateOrderInsideOrders(order.orders, order_id, state, note);
    const currentState = await DeliveryTripUtils.getCurrentTrip(order);
    let stateValue = currentState === -1 ? "ReturnWareHouse" : "Shipping";
    await this.updateOrders(order);
    return await this.updateStateDeliveryTrip(trip_id, order, stateValue);
  }

  static async updateStateDeliveryTrip(trip_id, deliveryTrip, state) {
    let current = await DeliveryTripUtils.getCurrentTrip(deliveryTrip);
    let current_state = {
      item: current === -1 ? 0 : current,
      state: StateUtils.DeliveryTripStateValue(state),
      stateValue: StateUtils.DeliveryTripState(state),
    };
    const payload = {
      $set: {
        status: StateUtils.DeliveryTripState(state),
        current_state: current_state,
      },
      $push: {
        state: current_state,
      },
    };
    return await DeliveryTripRepository.updateTripById(trip_id, payload);
  }

  static async DoneDeliveryTrip(trip_id) {
    const { account, deliveryTrip } = await this.getAccountInDeliveryTrip(
      trip_id
    );
    if (
      deliveryTrip.current_state.stateValue !==
      StateUtils.DeliveryTripState("ReturnWareHouse")
    )
      throw new BadRequestError("You Cannot Done The Delivery Trip!");

    await this.modifyFinishedOrders(deliveryTrip.orders);

    const accountResult = await AccountRepository.updateStateAccount(
      account._id,
      1
    );

    let stateValue = "Done";
    await this.updateStateDeliveryTrip(trip_id, deliveryTrip, stateValue);
    const payload = {
      account_id: account._id,
      title: "Done Delivery Trip",
      message: "Your Delivery Trip Has Been Done",
      status: 1,
    };

    await this.SendNotification(payload, StateUtils.AccountState("Available"));
    return await this.updateOrdersWithMainStatus(trip_id);
  }

  static async modifyFinishedOrders(orders) {
    await Promise.all(
      orders.map(async (order) => {
        if (order.status === 2) {
          await OrderService.failedToShiping(order.order);
        } else if (order.status === 1) {
          await RevenueService.addRevenueOrder(
            order.order.toString(),
            order.amount
          );
        }
      })
    );
  }

  static async updateOrderInsideOrders(orders, order_id, state, note) {
    const foundIndex = orders.findIndex(
      (order) => order.order.toString() === order_id
    );
    if (foundIndex === -1) return orders;
    orders[foundIndex].status = state;
    if (state == 1) {
      await OrderService.doneShipping(order_id, note);
    } else {
      await OrderService.updateSubstateShipping(order_id, note);
    }
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

  static async startDeliveryTrip(trip_id) {
    const { account, deliveryTrip } = await this.getAccountInDeliveryTrip(
      trip_id
    );

    let current_state = {
      item: await DeliveryTripUtils.getCurrentTrip(deliveryTrip),
      state: StateUtils.DeliveryTripStateValue("Shipping"),
      stateValue: StateUtils.DeliveryTripState("Shipping"),
    };
    const payload = {
      $set: {
        status: StateUtils.DeliveryTripState("Shipping"),
        current_state: current_state,
      },
      $push: {
        state: current_state,
      },
    };
    return await DeliveryTripRepository.updateTripById(trip_id, payload);
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

    let { orderState, orders } = await this.modifyOrders(deliveryTrip.orders);

    await this.updateSubState(deliveryTrip, orderState, "Waiting");

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

  static async updateSubState(payload, orderState, state) {
    payload.orders.forEach(async (order) => {
      if (!orderState[order.order])
        throw new NotFoundError("Error With Order Choosen!");

      let stateValue =
        StateUtils.OrderState(orderState[order.order]) ==
        StateUtils.OrderState("Shipping")
          ? StateUtils.ShippingState(state)
          : StateUtils.ProcessingState(state);

      await OrderRepository.updateSubStateInsideOrderTracking(
        order.order,
        StateUtils.OrderState(orderState[order.order]),
        stateValue
      );
    });
  }
}
module.exports = DeliveryTripService;
