const RoleRepository = require("../models/repositories/roleRepository");
class RoleService {
  static async createRole(payload) {
    return await RoleRepository.create(payload);
  }
  static async getRoles() {
    return await RoleRepository.getRoles();
  }
  static async findRole(role_id) {
    return await RoleRepository.fimdRoleById(role_id);
  }
}
module.exports = RoleService;
