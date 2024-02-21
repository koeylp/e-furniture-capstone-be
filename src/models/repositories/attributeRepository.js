const { default: mongoose } = require("mongoose");
const _Attribute = require("../../models/attributeModel");
const { checkValidId } = require("../../utils");
const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/errorHanlder");

class AttributeRepository {
  static async checkArrayExist(attributes) {
    const arrayOfObjectIds = attributes.map((obj) => {
      checkValidId(obj);
      obj = new mongoose.Types.ObjectId(obj);
      return obj;
    });
    const result = await _Attribute.find({ _id: { $in: arrayOfObjectIds } });
    if (attributes.length > result.length)
      throw new BadRequestError("Cannot Find Attributes Value!");
    return true;
  }
  static async createAttribute(payload) {
    const attribute = await _Attribute.create({
      name: payload.name,
      type: payload.type,
      status: payload.status,
    });
    if (!attribute) throw new InternalServerError();
    return attribute;
  }
  static async getAllAttribute() {
    return await _Attribute.find().lean();
  }
  static async findAttributeById(attribute_id) {
    checkValidId(attribute_id);
    const attribute = await _Attribute
      .findOne({
        _id: new mongoose.Types.ObjectId(attribute_id),
        status: 1,
      })
      .lean();
    if (!attribute) throw new BadRequestError();
    return attribute;
  }
}
module.exports = AttributeRepository;
