const RoleFactory = require("../services/roleFactory/role");

const sortPhase = new Map([
  ["login_user", [global.PermissionConstants.USER_GET]],
  [
    "login_efurniture",
    [
      global.PermissionConstants.STAFF_GET,
      global.PermissionConstants.ADMIN_GET,
      global.PermissionConstants.ADMIN_MASTER_GET,
    ],
  ],
  ["login_delivery", [global.PermissionConstants.DELIVERY_GET]],
]);
const returnLoginPhase = (code) => {
  return sortPhase.get(code) || sortPhase.get("login_user");
};
function hasPermission(roles, roleRequired) {
  const roleSet = new Set(roles.map((role) => role.toString()));
  return roleRequired.some((role) => roleSet.has(role.toString()));
}
const checkPermissionLogin = async (role, enumLogin = "login_user") => {
  const roleArray = await RoleFactory.permissionArray(role);
  let roleRequire = returnLoginPhase(enumLogin);
  roleRequire = await RoleFactory.getListRolePermission(roleRequire);
  let check = hasPermission(roleArray, roleRequire);
  return check;
};
module.exports = {
  checkPermissionLogin,
};
