const AttributeRepository = require("../models/repositories/attributeRepository");
class AttributeService {
  static async createAttribute(payload) {
    return await AttributeRepository.createAttribute(payload);
  }
  static async getAttributes() {
    return await AttributeRepository.getAllAttribute();
  }
  static async findAttribute(attribute_id) {
    return await AttributeRepository.findAttributeById(attribute_id);
  }
}
module.exports = AttributeService;
