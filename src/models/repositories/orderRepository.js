const _Order = require("../orderModel");
const { getUnSelectData, checkValidId } = require("../../utils");
const { default: mongoose } = require("mongoose");
const { generateOrderCode } = require("../../utils/generateOrderCode");
const { InternalServerError } = require("../../utils/errorHanlder");
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
    console.log(order);
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
    if (
      order.payment_method === "COD" &&
      order.order_checkout.final_total < 1000000
    )
      newOrder.order_tracking.push({ name: "Processing", note: order.note });
    else newOrder.order_tracking.push({ note: order.note });
    await newOrder.save();
    const populatedOrder = await _Order
      .findById(newOrder._id)
      .populate("order_products.product_id")
      .lean({ virtuals: true });
    return populatedOrder;
  }
  static async updateOrderTracking(order_id, updatePush, updateSet) {
    const query = {
      _id: new mongoose.Types.ObjectId(order_id),
      status: 1,
    };
    return await _Order
      .findOneAndUpdate(
        query,
        {
          $push: { order_tracking: updatePush },
          $set: updateSet,
        },
        { new: true }
      )
      .lean({ virtuals: true });
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
  static async paid(account_id, order_id, paid_amount) {
    let order = await _Order
      .findOne({
        _id: new mongoose.Types.ObjectId(order_id),
        account_id: account_id,
        guest: false,
        "order_tracking.name": { $ne: "Processing" },
      })
      .lean();

    if (!order) {
      throw new InternalServerError("This order is already in processing.");
    }
    let finalTotalUpdate;
    if (order.order_checkout.paid.type === "Deposit") {
      finalTotalUpdate = order.order_checkout.final_total - paid_amount;
    } else {
      finalTotalUpdate = order.order_checkout.final_total;
    }
    order = await _Order.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(order_id),
        account_id: account_id,
        guest: false,
        "order_tracking.name": { $ne: "Processing" },
      },
      {
        $set: {
          "order_checkout.is_paid": true,
          "order_checkout.paid.paid_amount": paid_amount,
          "order_checkout.final_total": finalTotalUpdate,
        },
        $push: { order_tracking: { name: "Processing" } },
      },
      { new: true, lean: true }
    );
    if (!order) {
      throw new InternalServerError("This order is already in processing.");
    }
    return order;
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
    return await _Order
      .findByIdAndUpdate(
        order_id,
        { $push: { "order_tracking.$[element].substate": newSubstate } },
        { arrayFilters: [{ "element.name": "Shipping" }], new: true }
      )
      .lean({ virtuals: true });
  }
  static async checkFailedOrders(orderId) {
    const failedOrder = await _Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
          status: 1, // Only consider orders with status 1
        },
      },
      {
        $project: {
          _id: 1,
          order_tracking: 1,
          failedCount: {
            $size: {
              $filter: {
                input: "$order_tracking.substate",
                as: "substate",
                cond: { $eq: ["$$substate.type", "Failed"] },
              },
            },
          },
        },
      },
      {
        $match: {
          failedCount: { $gte: 3 }, // Check if failedCount is 3 or more
        },
      },
    ]);

    // Update the status of failed order
    if (failedOrder.length > 0) {
      const updatedOrder = await _Order.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(orderId) },
        {
          $push: {
            order_tracking: {
              name: "Failed",
              status: 1,
            },
          },
          $set: { status: 0 },
        },
        { new: true }
      );
      return updatedOrder;
    }

    return failedOrder;
  }
  static async updateOrder(order) {
    await _Order
      .findOneAndUpdate(order._id, order, { new: true })
      .lean({ virtuals: true });
  }
}
module.exports = OrderRepository;
