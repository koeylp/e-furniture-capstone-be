const RoleRepository = require("../models/repositories/roleRepository");
const { sortPhase, permissionArray } = require("../../tests/roleTest");
class RoleService {
  static async createRole(payload) {
    return await RoleRepository.create(payload);
  }
  static async getRoles() {
    return await RoleRepository.getRoles();
  }
  static async getRoleValue(roles) {}
  static async convertRoleValueToEnum() {
    const roles = await RoleRepository.getRoles();
    let item = 1;
    roles.forEach((role) => {
      sortPhase.set(item, role.permission);
      item++;
    });
  }
}
RoleService.convertRoleValueToEnum();
module.exports = RoleService;
