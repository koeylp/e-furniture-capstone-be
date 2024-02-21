const _Showroom = require("../showroomModel");
const { getUnSelectData } = require("../../utils");

class ShowroomRepository {
  static async findByQuery(query) {
    return await _Showroom
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async createShowroom(showroom) {
    const newShowroom = await _Showroom.create(showroom);
    return newShowroom;
  }

  static async findAll() {
    return await _Showroom
      .find({})
      .select(getUnSelectData(["__v"]))
      .lean();
  }
}
module.exports = ShowroomRepository;
