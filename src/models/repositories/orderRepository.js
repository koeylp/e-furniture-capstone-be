const _Order = require("../orderModel");
const { getUnSelectData, checkValidId } = require("../../utils");
const { default: mongoose } = require("mongoose");
const { generateOrderCode } = require("../../utils/generateOrderCode");
class OrderRepository {
  static async getOrders({ query = {}, page, limit }) {
    const skip = (page - 1) * limit;
    const result = await _Order
      .find(query)
      .populate("order_products.product_id")
      .sort([["createdAt", -1]])
      .select(getUnSelectData(["__v"]))
      .skip(skip)
      .limit(limit)
      .lean({ virtuals: true })
      .exec();
    return { total: result.length, data: result };
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
    const order = await _Order
      .findOne(query)
      .populate("order_products.product_id")
      .select(getUnSelectData(["__v"]))
      .lean({ virtuals: true })
      .exec();
    return order;
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
    if (order.payment_method === "COD")
      newOrder.order_tracking.push({ name: "Processing", note: order.note });
    else newOrder.order_tracking.push({ note: order.note });
    await newOrder.save();
    return newOrder;
  }
  static async updateOrderTracking(order_id, updatePush, updateSet) {
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order.findOneAndUpdate(
      query,
      {
        $push: { order_tracking: updatePush },
        $set: updateSet,
      },
      { new: true }
    );
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
    newOrder.order_tracking.push({ name: "Processing", note: order.note });
    await newOrder.save();
    return newOrder;
  }
  static async paid(account_id, order_id) {
    return await _Order
      .findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(order_id),
          account_id: account_id,
          guest: false,
          payment_method: "Online Payment",
        },
        {
          $set: { "order_checkout.is_paid": true },
          $push: { order_tracking: { name: "Processing" } },
        },
        { new: true }
      )
      .populate("order_products.product_id");
  }
  static async acceptCancel(order_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order.updateOne(
      query,
      { $set: { "order_tracking.$[element].status": 1 } },
      { arrayFilters: [{ "element.name": "Cancelled" }] }
    );
  }
  static async update(order_id, newSubstate) {
    return await _Order.findByIdAndUpdate(
      order_id,
      { $push: { "order_tracking.$[element].substate": newSubstate } },
      { arrayFilters: [{ "element.name": "Shipping" }], new: true }
    );
  }
}
module.exports = OrderRepository;
