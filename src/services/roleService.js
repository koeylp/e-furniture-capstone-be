const RoleRepository = require("../models/repositories/roleRepository");
const { BadRequestError, NotFoundError } = require("../utils/errorHanlder");
const RoleFactory = require("../services/roleFactory/role");
class RoleService {
  static async createRole(payload) {
    const role = await RoleRepository.findRoleByPermission(payload.permission);
    if (role) throw new BadRequestError("Permission is already in use!");
    const result = await RoleRepository.create(payload);
    let role_action = `${result.role}_${result.action}`;
    RoleFactory.registerRoleType(role_action, result.permission);
  }
  static async getRoles() {
    return await RoleRepository.getRoles();
  }
  static async findRoleById(role_id) {
    return await RoleRepository.findRoleById(role_id);
  }
  static async updateRole(role_id, payload) {
    const roleBefore = await RoleRepository.findRoleById(role_id);
    const result = await RoleRepository.updateRole(role_id, payload);
    if (!result) throw new NotFoundError("Can not Find Role To Update!");
    let role_action = `${roleBefore.role}_${roleBefore.action}`;
    RoleFactory.updateRolePermission(role_action, payload.permission);
  }
  static async deleteRole(role_id) {
    const roleBefore = await RoleRepository.findRoleById(role_id);
    let role_action = `${roleBefore.role}_${roleBefore.action}`;
    await RoleRepository.deleteRole(role_id);
    RoleFactory.unregisterRoleType(role_action);
  }
}
module.exports = RoleService;
