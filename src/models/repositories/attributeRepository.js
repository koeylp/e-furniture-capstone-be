const { default: mongoose } = require("mongoose");
const _Attribute = require("../../models/attributeModel");
const { checkValidId } = require("../../utils");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
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
    if (!attribute) throw new NotFoundError();
    return attribute;
  }
  static async findAttributeByName(name) {
    return await _Attribute
      .findOne({
        name: name,
        status: 1,
      })
      .lean();
  }
  static async enableAttribute(attribute_id) {
    const attribute = await this.findAttributeById(attribute_id);
    const checkAttribute = await this.findAttributeByName(attribute.name);
    if (checkAttribute)
      throw new BadRequestError("Attribute Name is already in use!");
    const query = {
      _id: new mongoose.Types.ObjectId(attribute_id),
    };
    const update = {
      $set: {
        status: 1,
      },
    };
    return await _Attribute.findByIdAndUpdate(query, update, { new: true });
  }
  static async disableAttribute(attribute_id) {
    checkValidId(attribute_id);
    const query = {
      _id: new mongoose.Types.ObjectId(attribute_id),
    };
    const update = {
      $set: {
        status: 0,
      },
    };
    return await _Attribute.findByIdAndUpdate(query, update, { new: true });
  }
}
module.exports = AttributeRepository;
