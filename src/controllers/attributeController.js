const { OK } = require("../utils/successHandler");
const AttributeService = require("../services/attributeService");
const { BadRequestError } = require("../utils/errorHanlder");
class AttributeController {
  static async createAttribute(req, res, next) {
    return new OK({
      message: "Create Attribute Successfully!",
      metaData: await AttributeService.createAttribute(req.body),
    }).send(res);
  }
  static async getAllAttribute(req, res, next) {
    return new OK({
      message: "List Of Attribute!",
      metaData: await AttributeService.getAttributes(),
    }).send(res);
  }
  static async findAttribute(req, res, next) {
    const { attribute_id } = req.params;
    if (!attribute_id) throw new BadRequestError();
    return new OK({
      message: "List Of Attribute!",
      metaData: await AttributeService.findAttribute(attribute_id),
    }).send(res);
  }
}
module.exports = AttributeController;
