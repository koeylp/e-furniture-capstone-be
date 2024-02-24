const RoleService = require("../services/roleService");
const { OK } = require("../utils/successHandler");
class RoleController {
  static async create(req, res) {
    return new OK({
      message: "Create Role Successfully!!",
      metaData: await RoleService.createRole(req.body),
    }).send(res);
  }
  static async check(req, res) {
    return new OK({
      message: "Create Role Successfully!!",
      metaData: await RoleService.convertRoleValueToEnum(),
    }).send(res);
  }
  static async getRole(req, res) {
    return new OK({
      message: "Create Role Successfully!!",
      metaData: await RoleService.getRoles(),
    }).send(res);
  }
}
module.exports = RoleController;
