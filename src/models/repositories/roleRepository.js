const _Role = require("../roleModel");
const { InternalServerError } = require("../../utils/errorHanlder");
class RoleRepository {
  static async create(payload) {
    const role = await _Role.create({
      role: payload.role,
      value: payload.value,
      permission: payload.permission,
      action: payload.action,
    });
    if (!role) throw new InternalServerError();
  }
}
module.exports = RoleRepository;
