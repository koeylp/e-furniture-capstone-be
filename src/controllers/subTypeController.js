const SubTypeService = require("../services/subTypeService");
const { OK } = require("../utils/successHandler");
class SubTypeController {
  static async getSubTypeDetail(req, res) {
    const { slug, type } = req.params;
    return new OK({
      message: "SubType Detail!",
      metaData: await SubTypeService.getSubTypeDetail(slug, type),
    }).send(res);
  }
}
module.exports = SubTypeController;
