const { BadRequestError } = require("../utils/errorHanlder");
const RoomRepository = require("../models/repositories/roomRepository");
const { returnSortType } = require("./productFactory/sortType");
const RoomUtils = require("../utils/roomUtils");
const sortPhase = new Map([
  ["name_asc", { name: 1 }],
  ["name_desc", { name: -1 }],
  ["default", { _id: 1 }],
]);
const returnSortPhase = (code) => {
  return sortPhase.get(code) || sortPhase.get("default");
};
class RoomService {
  static async createRoom(payload) {
    const roomCheck = await RoomRepository.findRoomByName(payload.name);
    if (roomCheck) throw new BadRequestError("Room name is already in use!");
    const products = await RoomUtils.checkProducts(payload.products);
    payload.products = products;
    return await RoomRepository.createRoom(payload);
  }
  static async getRooms(page = 1, limit = 12, sortType = "default") {
    const sort = returnSortPhase(sortType);
    return await RoomRepository.getRooms({ limit, sort, page });
  }
  static async getPublishRooms(page = 1, limit = 12, sortType = "default") {
    const sort = returnSortType(sortType);
    const query = {
      is_draft: false,
      is_published: true,
    };
    return await RoomRepository.getRooms({ limit, sort, page, query });
  }
  static async getDraftRooms(page = 1, limit = 12, sortType = "default") {
    const sort = returnSortType(sortType);
    const query = {
      is_draft: true,
      is_published: false,
    };
    return await RoomRepository.getRooms({ limit, sort, page, query });
  }
  static async findRoom(room_slug) {
    return await RoomRepository.findRoomBySlug(room_slug);
  }
  static async editRoom(room_slug, payload) {
    if (payload.name) {
      const roomCheck = await RoomRepository.findRoomByName(payload.name);
      if (roomCheck && roomCheck.slug != room_slug)
        throw new BadRequestError("Room name is already in use!");
    }
    if (payload.products) {
      const products = await RoomUtils.checkProducts(payload.products);
      payload.products = products;
    }
    return await RoomRepository.editRoom(room_slug, payload);
  }
  static async disableRoom(room_id) {
    return await RoomRepository.draftRoom(room_id);
  }
  static async enableRoom(room_id) {
    return await RoomRepository.publishRoom(room_id);
  }
  static async removeRoom(room_id) {
    return await RoomRepository.removeRoom(room_id);
  }
}
module.exports = RoomService;
