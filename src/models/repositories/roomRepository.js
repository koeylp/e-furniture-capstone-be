const { default: mongoose } = require("mongoose");
const _Room = require("../roomModel");
const { checkValidId, getSelectData } = require("../../utils");
const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/errorHanlder");
class RoomRepository {
  static async createRoom(name, description, thumb, status) {
    const room = await _Room.create({
      name,
      description,
      thumb,
      status,
    });
    if (!room) throw new InternalServerError();
    return room;
  }
  static async findRoomByName(name) {
    const query = { name: name, status: 1 };
    return await _Room.findOne(query);
  }
  static async findRoomById(room_id) {
    checkValidId(room_id);
    const query = { _id: new mongoose.Types.ObjectId(room_id), status: 1 };
    const room = await _Room.findOne(query);
    if (!room) throw new BadRequestError("Cannot Find Any Room Result!");
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
      .select(getSelectData(filter))
      .lean();
  }
  static async editRoom(room_id, name, description, thumb) {
    const room = await this.findRoomById(room_id);
    room.name = name;
    room.description = description;
    room.thumb = thumb;
    return await _Room.update(room);
  }
  static async enableRoom(room_id) {
    const room = await this.findRoomById(room_id);
    const roomCheck = await this.findRoomByName(room.name);
    if (roomCheck._id != new mongoose.Types.ObjectId(room_id))
      throw new BadRequestError("Cannot Enable This Room!");
    room.status = 1;
    return await _Room.update(room);
  }
  static async disableRoom(room_id) {
    const room = await this.findRoomById(room_id);
    room.status = 0;
    return await _Room.update(room);
  }
}
module.exports = RoomRepository;