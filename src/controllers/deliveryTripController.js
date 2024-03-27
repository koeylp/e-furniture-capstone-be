const DeliveryTripService = require("../services/deliveryTripService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateCreateDeliveryTrip } = require("../utils/validation");
class DeliveryTripController {
  static async createTrip(req, res) {
    const { error } = validateCreateDeliveryTrip(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Trip Successfully!",
      metaData: await DeliveryTripService.create(req.body),
    }).send(res);
  }
  static async findTrip(req, res) {
    const { trip_id } = req.params;
    if (!trip_id) throw new BadRequestError();
    return new OK({
      message: "Trip Detail!",
      metaData: await DeliveryTripService.findTrip(trip_id),
    }).send(res);
  }
  static async updateOrderInTripStatus(req, res) {
    const { trip_id } = req.params;
    const { order_id, state } = req.body;
    if (!trip_id || !order_id || !state) throw new BadRequestError();
    return new OK({
      message: "Trip Detail!",
      metaData: await DeliveryTripService.updateTrip(trip_id, order_id, state),
    }).send(res);
  }
  static async updateTripStatus(req, res) {
    const { trip_id } = req.params;
    if (!trip_id) throw new BadRequestError();
    return new OK({
      message: "Done Trip Successfully!",
      metaData: await DeliveryTripService.updateTripStatus(trip_id),
    }).send(res);
  }
}
module.exports = DeliveryTripController;
