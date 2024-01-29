const _Type = require("../typeModel");
const {
  getSelectData,
  getUnSelectData,
  checkValidId,
  removeDuplicates,
} = require("../../utils/index");
const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
class TypeRepository {
  static async getTypes(query = {}) {
    return await _Type.find(query).lean();
  }
  static async createType(typeName, subTypes) {
    const type = await _Type.create({
      name: typeName,
      subTypes: removeDuplicates(subTypes),
    });
    if (!type) throw new InternalServerError();
    return type;
  }
  static async existTypeName(typeName) {
    const query = {
      name: typeName,
    };
    return await _Type.findOne(query).lean().exec();
  }
  static async findTypeByName(typeName) {
    const query = {
      name: typeName,
    };
    const type = await _Type
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
    if (!type) throw new BadRequestError();
    return type;
  }
  static async findTypeById(type_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
    };
    const type = await _Type
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
    if (!type) throw new BadRequestError();
    return type;
  }
  static async addSubType(type_id, subType) {
    checkValidId(type_id);
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
    };
    const update = {
      $push: {
        subTypes: subType,
      },
    };
    const addResult = await _Type.updateOne(query, update, { isNew: true });
    if (!addResult) throw new InternalServerError();
    return addResult;
  }
  static async createSubTypeValue(
    subTypeModel,
    subType,
    description,
    thumb,
    attributes
  ) {
    const result = await subTypeModel.create({
      type: subType,
      description,
      thumb,
      attributes,
    });
    if (!result) throw new InternalServerError("Cannot Add SubType Value!");
    return result;
  }
  static async editTypeName(type_id, typeName) {
    checkValidId(type_id);
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
    };
    const update = {
      $set: {
        name: typeName,
      },
    };
    return await _Type.updateOne(query, update, { isNew: true });
  }
  static async editType(type) {
    return await _Type.updateOne(type);
  }
  static async unPublishedType(type_id) {
    checkValidId(type_id);
    const type = await this.findTypeById(type_id);
    type.isPublished = false;
    return await _Type.updateOne(type);
  }
  static async publishedType(type_id) {
    checkValidId(type_id);
    const type = await this.findTypeById(type_id);
    const typeCheck = await this.existTypeName(type.name);
    if (typeCheck) throw new BadRequestError(`${type.name} is already in use!`);
    type.isPublished = true;
    return await _Type.updateOne(type);
  }
}
module.exports = TypeRepository;
