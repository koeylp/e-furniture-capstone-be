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
