const _Type = require("../typeModel");
const {
  getUnSelectData,
  checkValidId,
  removeDuplicates,
} = require("../../utils/index");
const {
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const { default: mongoose } = require("mongoose");
class TypeRepository {
  static async getTypes(
    page,
    limit,
    query = {},
    option = ["__v", "createdAt", "updatedAt", "is_published"]
  ) {
    const skip = (page - 1) * limit;
    return await _Type
      .find(query)
      .skip(skip)
      .limit(limit)
      .select(getUnSelectData(option))
      .lean();
  }
  static async getPublishedTypes(page, limit) {
    const option = [
      "__v",
      "createdAt",
      "updatedAt",
      "is_published",
      "is_draft",
      "subTypes",
    ];
    const query = {
      is_draft: false,
      is_published: true,
    };
    return await this.getTypes(page, limit, query, option);
  }
  static async getUnPublishedTypes(page, limit) {
    const query = {
      is_draft: true,
      is_published: false,
    };
    return await this.getTypes(page, limit, query);
  }
  static async createType(typeName, thumb, subTypes) {
    const type = await _Type.create({
      name: typeName,
      thumb,
      subTypes: removeDuplicates(subTypes),
    });
    if (!type) throw new InternalServerError();
    return type;
  }
  static async existTypeName(typeName) {
    const query = {
      name: typeName,
      is_published: true,
      is_draft: false,
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
    if (!type) throw new NotFoundError();
    return type;
  }
  static async findTypeBySlug(type_slug) {
    const query = {
      slug: type_slug,
    };
    const type = await _Type
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
    if (!type) throw new NotFoundError();
    return type;
  }
  static async findTypeById(type_id) {
    checkValidId(type_id);
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
      is_draft: false,
      is_published: true,
    };
    const type = await _Type
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
    if (!type) throw new NotFoundError();
    return type;
  }
  static async pushSubType(type_id, subType) {
    checkValidId(type_id);
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
    };
    const update = {
      $push: {
        subTypes: subType,
      },
    };
    const addResult = await _Type.findByIdAndUpdate(query, update, {
      isNew: true,
    });
    if (!addResult) throw new InternalServerError();
    return addResult;
  }
  static async pullSubType(type_id, subType) {
    checkValidId(type_id);
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
    };
    const update = {
      $pull: {
        subTypes: subType,
      },
    };
    return await _Type.findByIdAndUpdate(query, update, {
      isNew: true,
    });
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
  static async updateType(type) {
    return await _Type.updateOne(type);
  }
  static async publishType(type_id) {
    checkValidId(type_id);
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
    };
    const update = {
      $set: {
        is_draft: false,
        is_published: true,
      },
    };
    return await _Type.updateOne(query, update, { isNew: true });
  }
  static async draftType(type_id) {
    checkValidId(type_id);
    const query = {
      _id: new mongoose.Types.ObjectId(type_id),
    };
    const update = {
      $set: {
        is_draft: true,
        is_published: false,
      },
    };
    return await _Type.updateOne(query, update, { isNew: true });
  }
  static async removeType(type_id) {
    checkValidId(type_id);
    return await _Type.findByIdAndDelete(type_id);
  }
  static async findTypeBySubType_Slug(subType_slug) {
    const query = {
      subTypes: { $in: [subType_slug] },
    };
    return await _Type.find(query).lean();
  }
}
module.exports = TypeRepository;
