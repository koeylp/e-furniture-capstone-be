const SubTypeGroupRepository = require("../models/repositories/subTypeGroupRepository");
class SubTypeGroupService {
  static async create(payload) {
    return await SubTypeGroupRepository.createGroup(payload);
  }
  static async getGroups() {
    return await SubTypeGroupRepository.getGroups();
  }
}
module.exports = SubTypeGroupService;
