const ShowroomService = require("../services/showroomService");
const { OK } = require("../utils/successHandler");

class ShowroomController {
  static async createShowroom(req, res) {
    const showroom = req.body;
    return new OK({
      message: "Create showroom successfully!",
      metaData: await ShowroomService.createShowroom(showroom),
    }).send(res);
  }

  static async getAllShowrooms(req, res) {
    return new OK({
      message: "All showrooms here!",
      metaData: await ShowroomService.getAllShowrooms(),
    }).send(res);
  }

  static async getShowroomById(req, res) {
    const showroom_id = req.params.showroom_id;
    return new OK({
      message: "All showrooms here!",
      metaData: await ShowroomService.getShowroomById(showroom_id),
    }).send(res);
  }
}
module.exports = ShowroomController;
