const { UnAuthorizedError } = require("../utils/errorHanlder");
const { permissionArray } = require("../../tests/roleTest");
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
    const roleArray = permissionArray(role);
    if (Array.isArray(hasRole) && hasRole.length !== 0) {
      let check = hasRole.some((element) => roleArray.includes(element));
      if (!check) throw new UnAuthorizedError("Action Denied");
      return next();
    }
    if (!roleArray.includes(hasRole))
      throw new UnAuthorizedError("Action Denied");
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  verifyRole,
  hasPermission,
  hasAccess,
};
