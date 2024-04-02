const _DeliveryTrip = require("../deliveryTripModel");
const { InternalServerError } = require("../../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
const { checkValidId } = require("../../utils");

class DeliveryRepository {
  static async createTrip(payload) {
    const result = await _DeliveryTrip.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }
  static async findTrip(payload) {
    return await _DeliveryTrip
      .findOne(payload)
      .populate({
        path: "orders.order",
        select: "order_shipping",
      })
      .lean();
  }
  static async getTrips(payload = {}) {
    return await _DeliveryTrip
      .find(payload)
      .populate({
        path: "orders.order",
        select: "order_shipping",
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
  static async findTripByAccount(account_id) {
    checkValidId(account_id);
    const payload = {
      account_id: new mongoose.Types.ObjectId(account_id),
      status: 0,
    };
    return this.findTrip(payload);
  }
  static async updateTrip(payload, update) {
    return await _DeliveryTrip.findOneAndUpdate(payload, update, { new: true });
  }
}
module.exports = DeliveryRepository;
