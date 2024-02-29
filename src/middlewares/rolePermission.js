const { UnAuthorizedError } = require("../utils/errorHanlder");
const RoleFactory = require("../services/roleFactory/role");

const verifyRole = async (req, res, next) => {
  const { role } = req.payload;
  if (!role) throw new UnAuthorizedError();
  next();
};
const hasAccess = (accessNumber) => async (req, res, next) => {
  try {
    const { role } = req.payload;
    if (!role) throw new UnAuthorizedError();
    if (role < accessNumber) throw new UnAuthorizedError();
    next();
  } catch (error) {
    next(error);
  }
};
const hasPermission = (hasRole) => async (req, res, next) => {
  try {
    const { role } = req.payload;
    if (!role) throw new UnAuthorizedError();
    const roleArray = RoleFactory.permissionArray(role);
    if (Array.isArray(hasRole) && hasRole.length !== 0) {
      let constantRole = hasRole.map((role) => {
        return RoleFactory.roleRegistry[role];
      });
      let check = constantRole.some((element) => roleArray.includes(element));
      if (!check) throw new UnAuthorizedError("Action Denied");
      return next();
    }
    let constantRoleNotArray = RoleFactory.roleRegistry[hasRole];
    if (!roleArray.includes(constantRoleNotArray))
      throw new UnAuthorizedError("Action Denied");
    return next();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  verifyRole,
  hasPermission,
  hasAccess,
};
