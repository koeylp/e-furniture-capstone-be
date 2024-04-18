const RoleRepository = require("../../models/repositories/roleRepository");
const { checkValidId } = require("../../utils");
const { NotFoundError } = require("../../utils/errorHanlder");

class RoleFactory {
  static roleRegistry = {};
  static registerRoleType(role_action, permission) {
    if (!RoleFactory.roleRegistry[role_action]) {
      RoleFactory.roleRegistry[role_action] = permission;
    }
  }
  static async getRolePermission(role_action) {
    return RoleFactory.roleRegistry[role_action];
  }
  static async getListRolePermission(role_actions) {
    let permissions = [];
    for (const action of role_actions) {
      permissions.push(await this.getRolePermission(action));
    }
    return permissions;
  }
  static async registerRoles() {
    const roles = await RoleRepository.getRoles();
    roles.forEach((role) => {
      let role_action = `${role.role}_${role.action}`;
      RoleFactory.registerRoleType(role_action, role.permission);
    });
  }
  static async unregisterRoleType(role_action) {
    if (RoleFactory.roleRegistry[role_action]) {
      delete RoleFactory.roleRegistry[role_action];
    }
  }
  static updateRolePermission(role_action, newPermission) {
    if (RoleFactory.roleRegistry[role_action]) {
      RoleFactory.roleRegistry[role_action] = newPermission;
    }
  }
  static splitStringAndPushToArray(inputString) {
    return inputString.split("");
  }

  static permissionArray(decimalNumber) {
    const inputString = decimalNumber.toString(2);
    const resultArray =
      RoleFactory.splitStringAndPushToArray(inputString).reverse();
    const keys = Object.values(RoleFactory.roleRegistry);
    let permissionArray = [];
    for (let i = 1; i < resultArray.length + 1; i++) {
      if (resultArray[i] === "1") {
        permissionArray.push(keys[i - 1]);
      }
    }
    return permissionArray;
  }
  static async convertRole(role) {
    const arrayPermission = RoleFactory.permissionArray(role);
    if (!arrayPermission) throw new NotFoundError("Role is invalid!");
    return await RoleRepository.getRolesByPermissions(arrayPermission);
  }

  static async convertRoleFromRangeId(roles) {
    await Promise.all(roles.map((role) => checkValidId(role)));
    return await RoleRepository.getRolesByRangeId(roles);
  }
}
RoleFactory.registerRoles();
module.exports = RoleFactory;
