const SubTypeGroupRepository = require("../models/repositories/subTypeGroupRepository");
class SubTypeGroupService {
  static async create(payload) {
    return await SubTypeGroupRepository.createGroup(payload);
  }
}
module.exports = SubTypeGroupService;
