const RoleRepository = require("../models/repositories/roleRepository");
const { sortPhase } = require("../../tests/roleTest");
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
    roles.forEach((role) => {
      sortPhase.set(item.a, item.b);
    });
    console.log(sortPhase);
  }
}
module.exports = RoleService;
