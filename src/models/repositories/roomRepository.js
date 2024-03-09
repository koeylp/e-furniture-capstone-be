const { default: mongoose } = require("mongoose");
const _Room = require("../roomModel");
const {
  checkValidId,
  getSelectData,
  removeUndefineObject,
} = require("../../utils");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
class RoomRepository {
  static async createRoom(payload) {
    const room = await _Room.create(payload);
    if (!room) throw new InternalServerError();
    return room;
  }
  static async findRoomByName(name) {
    const query = { name: name, is_draft: false, is_published: true };
    return await this.findRoom(query);
  }
  static async findRoomById(room_id) {
    checkValidId(room_id);
    const query = {
      _id: new mongoose.Types.ObjectId(room_id),
      is_draft: false,
      is_published: true,
    };
    const room = await this.findRoom(query);
    if (!room) throw new NotFoundError("Cannot Find Any Room Result!");
    return room;
  }
  static async findRoomBySlug(room_slug) {
    const query = {
      slug: room_slug,
      is_draft: false,
      is_published: true,
    };
    const room = await _Room.findOne(query).populate({
      path: "products.product",
    });
    if (!room) throw new NotFoundError("Cannot Find Any Room Result!");
    return room;
  }
  static async findRoom(query) {
    const room = await _Room.findOne(query);
    return room;
  }
  static async getRooms({
    limit = 50,
    sort = "ctime",
    page = 1,
    query = {},
    filter = [],
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: 1 } : sort;
    return await _Room
      .find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .populate("products.product")
      .select(getSelectData(filter))
      .lean();
  }
  static async update(query, update) {
    update = removeUndefineObject(update);
    const room = await _Room.updateOne(query, update, { new: true });
    if (!room) throw new BadRequestError("Cannot Update Product!");
    return room;
  }
  static async editRoom(room_slug, payload) {
    const query = {
      slug: room_slug,
    };
    return await this.update(query, payload);
  }
  static async publishRoom(room_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(room_id),
    };
    const room = await this.findRoom(query);
    const roomCheck = await this.findRoomByName(room.name);
    if (roomCheck && roomCheck._id != new mongoose.Types.ObjectId(room_id))
      throw new BadRequestError("Cannot Enable This Room!");
    const update = {
      is_draft: false,
      is_published: true,
    };
    return await this.update(query, update);
  }
  static async draftRoom(room_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(room_id),
    };
    const update = {
      is_draft: true,
      is_published: false,
    };
    return await this.update(query, update);
  }
  static async removeRoom(room_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(room_id),
    };
    return await _Room.deleteOne(query);
  }
}
module.exports = RoomRepository;
