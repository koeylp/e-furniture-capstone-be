const SubTypeGroupService = require("../services/subTypeGroupService");
const { OK } = require("../utils/successHandler");
class SubTypeGroupController {
  static async create(req, res, next) {
    return new OK({
      message: "Create Group For SubType SucessFully!",
      metaData: await SubTypeGroupService.create(req.body),
    }).send(res);
  }
}
module.exports = SubTypeGroupController;
