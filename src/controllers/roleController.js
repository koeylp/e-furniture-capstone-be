const RoleFactory = require("../services/roleFactory/role");
const RoleService = require("../services/roleService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
class RoleController {
  static async create(req, res) {
    return new OK({
      message: "Create Role Successfully!!",
      metaData: await RoleService.createRole(req.body),
    }).send(res);
  }
  static async getRole(req, res) {
    return new OK({
      message: "Create Role Successfully!!",
      metaData: await RoleService.getRoles(),
    }).send(res);
  }
  static async findRole(req, res) {
    const { role_id } = req.params;
    if (!role_id) throw new BadRequestError();
    return new OK({
      message: "Create Role Successfully!!",
      metaData: await RoleService.findRoleById(role_id),
    }).send(res);
  }
  static async updateRole(req, res) {
    const { role_id } = req.params;
    if (!role_id) throw new BadRequestError();
    return new OK({
      message: "Update Role Successfully!!",
      metaData: await RoleService.updateRole(role_id, req.body),
    }).send(res);
  }
  static async deleteRole(req, res) {
    const { role_id } = req.params;
    if (!role_id) throw new BadRequestError();
    return new OK({
      message: "Delete Role Successfully!!",
      metaData: await RoleService.deleteRole(role_id),
    }).send(res);
  }
}
module.exports = RoleController;
