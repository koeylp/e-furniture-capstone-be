const MappingService = require("../services/mappingService");
const { OK } = require("../utils/successHandler");

class MappingController {
  static async getRouteData(req, res) {
    const origin = req.query.origin;
    const destination = req.query.destination;
    return new OK({
      message: "Route Data: ",
      metaData: await MappingService.getRouteData(origin, destination),
    }).send(res);
  }
}
module.exports = MappingController;
