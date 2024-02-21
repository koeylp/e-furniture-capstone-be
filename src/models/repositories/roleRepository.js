const _Role = require("../roleModel");
const {
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const { checkValidId, removeUndefineObject } = require("../../utils/index");
const { default: mongoose } = require("mongoose");
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
  static async getRoles() {
    return await _Role.find().lean();
  }
  static async fimdRoleById(role_id) {
    checkValidId(role_id);
    const role = await _Role.findOne({
      _id: new mongoose.Types.ObjectId(role_id),
    });
    if (!role) throw new NotFoundError();
    return role;
  }
  static async updateRole(role_id, payload) {
    checkValidId(role_id);
    const update = removeUndefineObject(payload);
    return await _Role.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(role_id) },
      update,
      { new: true }
    );
  }
  static async deleteRole(role_id) {
    return await _Role.findByIdAndDelete(role_id);
  }
}
module.exports = RoleRepository;
