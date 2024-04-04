const RoomService = require("../services/roomService");
const { OK } = require("../utils/successHandler");
const { BadRequestError } = require("../utils/errorHanlder");
const { validateCreateRoom, validateEditRoom } = require("../utils/validation");
class RoomController {
  static async createRoom(req, res) {
    const { error } = validateCreateRoom(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Room Successfully!",
      metaData: await RoomService.createRoom(req.body),
    }).send(res);
  }
  static async getRooms(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Of Room!",
      metaData: await RoomService.getRooms(page, limit, sortType),
    }).send(res);
  }
  static async getPublishRooms(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Of Room!",
      metaData: await RoomService.getPublishRooms(page, limit, sortType),
    }).send(res);
  }
  static async getDraftRooms(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Of Room!",
      metaData: await RoomService.getDraftRooms(page, limit, sortType),
    }).send(res);
  }
  static async findRoom(req, res) {
    const { room_slug } = req.params;
    if (!room_slug) throw new BadRequestError();
    return new OK({
      message: "Room Detail!",
      metaData: await RoomService.findRoom(room_slug),
    }).send(res);
  }
  static async editRoom(req, res) {
    const { room_slug } = req.params;
    if (!room_slug) throw new BadRequestError();
    const { error } = validateEditRoom(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Edit Room Successfully!",
      metaData: await RoomService.editRoom(room_slug, req.body),
    }).send(res);
  }
  static async enableRoom(req, res) {
    const { room_id } = req.params;
    if (!room_id) throw new BadRequestError();
    return new OK({
      message: "Change Room Status Successfully!",
      metaData: await RoomService.enableRoom(room_id),
    }).send(res);
  }
  static async disableRoom(req, res) {
    const { room_id } = req.params;
    if (!room_id) throw new BadRequestError();
    return new OK({
      message: "Change Room Status Successfully!",
      metaData: await RoomService.disableRoom(room_id),
    }).send(res);
  }
  static async removeRoom(req, res) {
    const { room_id } = req.params;
    if (!room_id) throw new BadRequestError();
    return new OK({
      message: "Delete Room Successfully!",
      metaData: await RoomService.removeRoom(room_id),
    }).send(res);
  }
}
module.exports = RoomController;
