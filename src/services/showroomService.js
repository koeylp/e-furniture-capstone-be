const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const ShowroomRepositoy = require("../models/repositories/showroomRepository");

class ShowroomService {
  static async handleShowroom(roomle_3d_id) {
    const QUERY = { roomle_3d_id: roomle_3d_id };
    let showroom = await ShowroomRepositoy.findByQuery(QUERY);
    if (showroom) {
      throw new BadRequestError("Showroom already exists");
    }
    return showroom;
  }

  static async createShowroom(showroom) {
    await this.handleShowroom(showroom.roomle_3d_id);
    return await ShowroomRepositoy.createShowroom(showroom);
  }

  static async getAllShowrooms() {
    return await ShowroomRepositoy.findAll();
  }

  static async getShowroomById(showroom_id) {
    const QUERY = { _id: showroom_id };
    const showroom = await ShowroomRepositoy.findByQuery(QUERY);
    if (!showroom) throw new NotFoundError("Showroom not found");
    return showroom;
  }
}

module.exports = ShowroomService;
