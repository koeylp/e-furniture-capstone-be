const _DeliveryTrip = require("../deliveryTripModel");
const { InternalServerError } = require("../../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
const { checkValidId } = require("../../utils");
const WareHouseRepository = require("./warehouseRepository");

class DeliveryRepository {
  static async createTrip(payload) {
    const result = await _DeliveryTrip.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }
  static async findTripWithoutPopulate(payload) {
    return await _DeliveryTrip.findOne(payload).lean();
  }
  static async findTrip(payload) {
    let result = await _DeliveryTrip
      .findOne(payload)
      .populate({
        path: "orders.order orders.order.warehouses warehouse",
        select:
          "order_shipping order_code payment_method order_tracking order_checkout order_products warehouses -products",
      })
      .lean({ virtuals: true });

    result.orders = await Promise.all(
      result.orders.map(async (item) => {
        const updatedWarehouses = await Promise.all(
          item.order.warehouses.map(async (inside) => {
            const data = await WareHouseRepository.getWareHouseByIDWithOptions(
              inside.warehouse_id
            );
            return { ...inside, warehouse_id: data[0] };
          })
        );
        return {
          ...item,
          order: { ...item.order, warehouses: updatedWarehouses },
        };
      })
    );

    return result;
  }
  static async findTrip(payload) {
    let result = await _DeliveryTrip
      .findOne(payload)
      .populate({
        path: "orders.order orders.order.warehouses",
        select:
          "order_shipping order_code payment_method order_tracking order_checkout order_products warehouses",
      })
      .sort({ _id: -1 })
      .lean({ virtuals: true });
    return result;
  }
  static async getTrips(payload = {}) {
    return await _DeliveryTrip
      .find(payload)
      .populate({
        path: "orders.order",
        select: "order_products order_shipping warehouses",
      })
      .lean();
  }
  static async findTripById(trip_id) {
    checkValidId(trip_id);
    const payload = {
      _id: new mongoose.Types.ObjectId(trip_id),
    };
    return this.findTrip(payload);
  }
  static async findTripByIdWithoutPopulate(trip_id) {
    checkValidId(trip_id);
    const payload = {
      _id: new mongoose.Types.ObjectId(trip_id),
    };
    return this.findTripWithoutPopulate(payload);
  }
  static async findTripByAccount(account_id) {
    checkValidId(account_id);
    const payload = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return this.findTrip(payload);
  }
  static async updateTrip(payload, update) {
    return await _DeliveryTrip.findOneAndUpdate(payload, update, { new: true });
  }

  static async updateTripById(trip_id, update) {
    checkValidId(trip_id);
    const query = {
      _id: new mongoose.Types.ObjectId(trip_id),
    };
    return await _DeliveryTrip.findOneAndUpdate(query, update, { new: true });
  }
}
module.exports = DeliveryRepository;
