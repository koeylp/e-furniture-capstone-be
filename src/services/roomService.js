const { BadRequestError } = require("../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
const RoomRepository = require("../models/repositories/roomRepository");
const { returnSortType } = require("./productFactory/sortType");
const sortPhase = new Map([
  ["name_asc", { name: 1 }],
  ["name_desc", { name: -1 }],
  ["default", { _id: 1 }],
]);
const returnSortPhase = (code) => {
  return sortPhase.get(code) || sortPhase.get("default");
};
class RoomService {
  static async createRoom({ name, description, thumb, status = 0 }) {
    const roomCheck = await RoomRepository.findRoomByName(name);
    if (roomCheck) throw new BadRequestError("Room name is already in use!");
    return await RoomRepository.createRoom(name, description, thumb, status);
  }
  static async getRooms(page = 1, limit = 12, sortType = "default") {
    const sort = returnSortPhase(sortType);
    return await RoomRepository.getRooms({ limit, sort, page });
  }
  static async getPublishRooms(page = 1, limit = 12, sortType = "default") {
    const sort = returnSortType(sortType);
    const query = {
      status: 1,
    };
    return await RoomRepository.getRooms({ limit, sort, page, query });
  }
  static async getDraftRooms(page = 1, limit = 12, sortType = "default") {
    const sort = returnSortType(sortType);
    const query = {
      status: 0,
    };
    return await RoomRepository.getRooms({ limit, sort, page, query });
  }
  static async findRoom(room_id) {
    return await RoomRepository.findRoomById(room_id);
  }
  static async editRoom(room_id, payload) {
    const roomCheck = await RoomRepository.findRoomByName(payload.name);
    if (roomCheck && roomCheck._id != new mongoose.Types.ObjectId(room_id))
      throw new BadRequestError("Room name is already in use!");
    return await RoomRepository.editRoom(
      room_id,
      payload.name,
      payload.description,
      payload.thumb
    );
  }
  static async disableRoom(room_id) {
    return await RoomRepository.disableRoom(room_id);
  }
  static async enableRoom(room_id) {
    return await RoomRepository.enableRoom(room_id);
  }
}
module.exports = RoomService;
