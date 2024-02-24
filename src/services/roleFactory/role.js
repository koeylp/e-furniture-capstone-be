const RoleRepository = require("../../models/repositories/roleRepository");

class RoleFactory {
  static roleRegistry = {};
  static registerRoleType(permission) {
    if (!RoleFactory.roleRegistry[permission]) {
      let index = RoleFactory.roleRegistry.size;
      RoleFactory.roleRegistry[index++] = permission;
    }
    console.log(RoleFactory.roleRegistry);
  }
  static async registerSubTypesFromMap() {
    const roles = await RoleRepository.getRoles();
    let item = 1;
    roles.forEach((role) => {
      sortPhase.set(item, role.permission);
      RoleFactory.registerRoleType(role.permission);
      item++;
    });
    console.log(RoleFactory.roleRegistry);
  }
  static async unregisterRoleType(type) {
    if (RoleFactory.roleRegistry[type]) {
      delete RoleFactory.roleRegistry[type];
    }
  }
}
RoleFactory.registerSubTypesFromMap();
module.exports = RoleFactory;
