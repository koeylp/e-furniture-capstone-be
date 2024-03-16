const _Order = require("../orderModel");
const { getUnSelectData, checkValidId } = require("../../utils");
const { default: mongoose } = require("mongoose");
const { generateOrderCode } = require("../../utils/generateOrderCode");
const { findOneAndUpdate } = require("../attributeModel");
class OrderRepository {
  static async getOrders({ query = {}, page, limit }) {
    const skip = (page - 1) * limit;
    const orders = await _Order.find({ status: 1 });
    const result = await _Order
      .find(query)
      .sort([["createdAt", -1]])
      .select(getUnSelectData(["__v"]))
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    return { total: orders.length, data: result };
  }
  static async getOrdersByUser(account_id, page, limit) {
    checkValidId(account_id);
    const query = {
      account_id: account_id,
      status: 1,
    };
    return await this.getOrders(query, page, limit);
  }
  static async getOrdersByType({ account_id, type, page, limit }) {
    const query = {
      ...(account_id && { account_id }),
      guest: false,
      status: 1,
    };
    if (type) {
      query.$expr = {
        $eq: [{ $arrayElemAt: ["$order_tracking.name", -1] }, type],
      };
    }
    return await this.getOrders({ query, page, limit });
  }
  static async findOrderById({ account_id = null, order_id }) {
    checkValidId(order_id);
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      ...(account_id && { account_id }),
      status: 1,
    };
    return await _Order
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
  }
  static async removeOrder(order_id) {
    checkValidId(order_id);
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order.deleteOne(query);
  }
  static async createOrder(account_id, order) {
    const order_code = generateOrderCode();
    const newOrder = await _Order.create({
      account_id: account_id,
      order_checkout: order.order_checkout,
      order_products: order.order_products,
      payment_method: order.payment_method,
      order_shipping: order.order_shipping,
      order_code: order_code,
    });
    if (!newOrder) throw new InternalServerError();
    newOrder.order_tracking.push({ note: order.note });
    await newOrder.save();
    return newOrder;
  }
  static async update(order_id, order_tracking, note) {
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    const update = { name: order_tracking, note: note };
    return await _Order.updateOne(query, {
      $push: { order_tracking: update },
    });
  }
  static async createOrderGuest(order) {
    const order_code = generateOrderCode();
    const newOrder = await _Order.create({
      guest: true,
      order_checkout: order.order_checkout,
      order_products: order.order_products,
      payment_method: order.payment_method,
      order_shipping: order.order_shipping,
      order_code: order_code,
    });
    if (!order) throw new InternalServerError();
    newOrder.order_tracking.push({ note: order.note });
    await newOrder.save();
    return newOrder;
  }
  static async paid(account_id, order_id) {
    return await _Order.updateOne(
      {
        _id: new mongoose.Types.ObjectId(order_id),
        account_id: account_id,
        guest: false,
      },
      { $set: { "order_checkout.is_paid": true } }
    );
  }
}
module.exports = OrderRepository;
