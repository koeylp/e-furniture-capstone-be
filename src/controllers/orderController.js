const OrderService = require("../services/orderSerivce");
const { BadRequestError } = require("../utils/errorHanlder");
const { capitalizeFirstLetter } = require("../utils/format");
const { OK } = require("../utils/successHandler");
const { validateOrderInput } = require("../utils/validation");

class OrderController {
  static async getOrders(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Order",
      metaData: await OrderService.getOrders(page, limit),
    }).send(res);
  }

  static async findOrder(req, res) {
    const { order_id } = req.params;
    if (!order_id) throw new BadRequestError();
    return new OK({
      message: "Order Detail!",
      metaData: await OrderService.findOrderDetail(order_id),
    }).send(res);
  }

  static async findOrderByUser(req, res) {
    const { account_id } = req.payload;
    const { page, limit } = req.query;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Of Order By User",
      metaData: await OrderService.findOrderByUser(account_id, page, limit),
    }).send(res);
  }

  static async findOrderByType(req, res) {
    const { page, limit, type, status } = req.query;
    return new OK({
      message: "List Of Order By Type",
      metaData: await OrderService.findOrderByType(
        capitalizeFirstLetter(type),
        page,
        limit,
        status
      ),
    }).send(res);
  }

  static async findOrderByTypeU(req, res) {
    const { page, limit, type } = req.query;
    const { account_id } = req.payload;
    return new OK({
      message: "List Of Order By Type",
      metaData: await OrderService.findOrderByTypeU(
        account_id,
        capitalizeFirstLetter(type),
        page,
        limit
      ),
    }).send(res);
  }

  static async removeOrder(req, res) {
    const { order_id } = req.params;
    if (!order_id) throw new BadRequestError();
    return new OK({
      message: "Remove Order Successfully!",
      metaData: await OrderService.removeOrder(order_id),
    }).send(res);
  }

  static async createOrder(req, res) {
    const { account_id } = req.payload;
    const order = req.body;
    if (!order) throw new BadRequestError();
    const { error } = validateOrderInput(order);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Order Successfully!",
      metaData: await OrderService.createOrder(account_id, order),
    }).send(res);
  }

  static async updateTracking(req, res) {
    const { order_id } = req.params;
    const { note } = req.body;
    if (!note) throw new BadRequestError("note is required");
    if (!order_id) throw new BadRequestError();
    return new OK({
      message: "Update Tracking Successfully!",
      metaData: await OrderService.updateTracking(order_id, note),
    }).send(res);
  }

  static async createOrderGuest(req, res) {
    const order = req.body;
    if (!order) throw new BadRequestError();
    const { error } = validateOrderInput(order);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Order Successfully!",
      metaData: await OrderService.createOrderGuest(order),
    }).send(res);
  }

  static async cancelOrder(req, res) {
    const { account_id } = req.payload;
    const { order_id } = req.params;
    const { note } = req.body;
    if (!note) throw new BadRequestError("Note's cancel is required");
    return new OK({
      message: "Send cancel order request successfully! Please, wait!",
      metaData: await OrderService.cancelOrder(account_id, order_id, note),
    }).send(res);
  }

  static async paid(req, res) {
    const { account_id } = req.payload;
    const transaction = req.body;
    return new OK({
      message: "You paid this order... Let's chill!",
      metaData: await OrderService.paid(account_id, transaction),
    }).send(res);
  }

  static async acceptCancel(req, res) {
    const { order_id } = req.params;
    return new OK({
      message: "Cancel Request Was Accepted!",
      metaData: await OrderService.acceptCancel(order_id),
    }).send(res);
  }

  static async getCancelRequests(req, res) {
    return new OK({
      message: "All Cancel Requests!",
      metaData: await OrderService.getCancelRequests(),
    }).send(res);
  }
  static async updateSubstateShipping(req, res) {
    const substate = req.body;
    const { order_id } = req.params;
    return new OK({
      message: "Update substate successfully",
      metaData: await OrderService.updateSubstateShipping(order_id, substate),
    }).send(res);
  }
  static async requestRefund(req, res) {
    const { order_id } = req.params;
    return new OK({
      message: "Request refund successfully",
      metaData: await OrderService.requestRefund(order_id),
    }).send(res);
  }
  static async processingToShiping(req, res) {
    const { order_id } = req.params;
    const { note } = req.body;
    return new OK({
      message: "Accept processing to shipping successfully",
      metaData: await OrderService.processingToShiping(order_id, note),
    }).send(res);
  }
  static async doneShipping(req, res) {
    const { order_id } = req.params;
    const { note } = req.body;
    return new OK({
      message: "Done shipping!",
      metaData: await OrderService.doneShipping(order_id, note),
    }).send(res);
  }
}
module.exports = OrderController;
