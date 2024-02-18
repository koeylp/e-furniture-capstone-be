const OrderService = require("../services/orderSerivce");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateOrderInput } = require("../utils/validation");

const CLIENT_ID = "x-client-id";

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
    const { account_id } = req.params;
    const { page, limit } = req.query;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Of Order By User",
      metaData: await OrderService.findOrderByUser(account_id, page, limit),
    }).send(res);
  }

  static async findOrderByType(req, res) {
    const { type } = req.params;
    const { page, limit } = req.query;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Of Order By Type",
      metaData: await OrderService.findOrderByType(type, page, limit),
    }).send(res);
  }

  static async findOrderByType(req, res) {
    const { order_id } = req.params;
    if (!order_id) throw new BadRequestError();
    return new OK({
      message: "Remove Order Successfully!",
      metaData: await OrderService.removeOrder(order_id),
    }).send(res);
  }

  static async createOrder(req, res) {
    const account_id = req.headers[CLIENT_ID];
    const order = req.body;
    if (!order) throw new BadRequestError();
    const { error } = validateOrderInput(order);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Order Successfully!",
      metaData: await OrderService.createOrder(account_id, order),
    }).send(res);
  }
}
module.exports = OrderController;
