const _SubTypeGroup = require("../subTypeGroupModel");
const {
  InternalServerError,
  BadRequestError,
} = require("../../utils/errorHanlder");
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
}
module.exports = SubTypeGroupRepository;
