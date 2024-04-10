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
      metaData: await DeliveryTripService.findTripById(trip_id),
    }).send(res);
  }
  static async findTripByAccount(req, res) {
    const { account_id } = req.params;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Trip!",
      metaData: await DeliveryTripService.findTripByAccount(account_id),
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
  static async DoneTripStatus(req, res) {
    const { trip_id } = req.params;
    if (!trip_id) throw new BadRequestError();
    return new OK({
      message: "Done Trip Successfully!",
      metaData: await DeliveryTripService.DoneDeliveryTrip(trip_id),
    }).send(res);
  }
  static async getTripPending(req, res) {
    return new OK({
      message: "List Trip!",
      metaData: await DeliveryTripService.getDeliveryTripPending(),
    }).send(res);
  }
  static async getAllTrip(req, res) {
    return new OK({
      message: "List Trip!",
      metaData: await DeliveryTripService.getAllDeliveryTrip(),
    }).send(res);
  }
  static async confirmDeliveryTrip(req, res) {
    const { trip_id } = req.params;
    if (!trip_id) throw new BadRequestError();
    return new OK({
      message: "Done Trip Successfully!",
      metaData: await DeliveryTripService.confirmDeliveryTrip(trip_id),
    }).send(res);
  }
  static async rejectDeliveryTrip(req, res) {
    const { trip_id } = req.params;
    const { note } = req.body;
    if (!trip_id) throw new BadRequestError();
    return new OK({
      message: "Reject Delivery Trip!",
      metaData: await DeliveryTripService.rejectDeliveryTrip(trip_id, note),
    }).send(res);
  }
}
module.exports = DeliveryTripController;
