const _Role = require("../roleModel");
const {
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const {
  checkValidId,
  removeUndefineObject,
  getUnSelectData,
} = require("../../utils/index");
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
    return role;
  }
  static async getRoles(query = {}, option = []) {
    return await _Role.find(query).select(getUnSelectData(option)).lean();
  }
  static async findRoleById(role_id) {
    checkValidId(role_id);
    const role = await _Role.findOne({
      _id: new mongoose.Types.ObjectId(role_id),
    });
    if (!role) throw new NotFoundError();
    return role;
  }
  static async findRoleByPermission(permission) {
    return await _Role
      .findOne({
        permission: permission,
      })
      .lean();
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
  static async getRolesByPermissions(permissionArray) {
    const option = ["createdAt", "updatedAt", "__v"];
    const query = {
      permission: { $in: permissionArray },
    };
    return await this.getRoles(query, option);
  }
  static async getRolesByRangeId(permissionArray_Id) {
    const option = ["createdAt", "updatedAt", "__v"];
    const query = {
      _id: { $in: permissionArray_Id },
    };
    return await this.getRoles(query, option);
  }
}
module.exports = RoleRepository;
