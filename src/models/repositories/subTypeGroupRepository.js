const _SubTypeGroup = require("../subTypeGroupModel");
const {
  InternalServerError,
  BadRequestError,
} = require("../../utils/errorHanlder");
const { checkValidId } = require("../../utils");
const { default: mongoose } = require("mongoose");
class SubTypeGroupRepository {
  static async createGroup(payload) {
    const group = await _SubTypeGroup.create({
      label: payload.label,
      status: payload.status,
    });
    if (!group) throw new InternalServerError();
    return group;
  }
  static async findGroupBySlug(group_slug) {
    const group = await _SubTypeGroup
      .findOne({
        slug: group_slug,
        status: 1,
      })
      .lean()
      .exec();
    if (!group) throw new BadRequestError();
    return group;
  }
  static async findGroupById(group_id) {
    checkValidId(group_id);
    const group = await _SubTypeGroup
      .findOne({
        _id: new mongoose.Types.ObjectId(group_id),
        status: 1,
      })
      .lean()
      .exec();
    if (!group) throw new BadRequestError();
    return group;
  }
}
module.exports = SubTypeGroupRepository;
