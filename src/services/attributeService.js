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
  static async enableAttribute(attribute_id) {
    return await AttributeRepository.enableAttribute(attribute_id);
  }
  static async disableAttribute(attribute_id) {
    return await AttributeRepository.disableAttribute(attribute_id);
  }
}
module.exports = AttributeService;
