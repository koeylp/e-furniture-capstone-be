const { default: mongoose } = require("mongoose");
const _Attribute = require("../../models/attributeModel");
const { checkValidId } = require("../../utils");
const { BadRequestError } = require("../../utils/errorHanlder");

class AttributeRepository {
  static async checkArrayExist(attributes) {
    const arrayOfObjectIds = attributes.map((obj) => {
      checkValidId(obj._id);
      obj._id = new mongoose.Types.ObjectId(obj._id);
      return obj._id;
    });
    const result = await _Attribute.find({ _id: { $in: arrayOfObjectIds } });
    if (attributes.length > result.length)
      throw new BadRequestError("Cannot Find Attributes Value!");
    return true;
  }
}
module.exports = AttributeRepository;
