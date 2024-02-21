const AttributeRepository = require("../models/repositories/attributeRepository");
const ProductRepository = require("../models/repositories/productRepository");
const SubTypeRepository = require("../models/repositories/subTypeRepository");
const TypeRepository = require("../models/repositories/typeRepository");
const SubTypeGroupRepository = require("../models/repositories/subTypeGroupRepository");
const { generateSubTypeSchema } = require("../models/subTypeModel");
const { BadRequestError } = require("../utils/errorHanlder");

class SubTypeService {
  static async addSubType(payload) {
    const type = await TypeRepository.findTypeById(payload.type_id);
    const subTypeModel = global.subTypeSchemasMap.get(type.slug);
    if (!subTypeModel) throw new BadRequestError("Type is not in use!");
    if (type.subTypes.includes(payload.subType))
      throw new BadRequestError(
        `${payload.subType} is already in ${type.name}`
      );
    await AttributeRepository.checkArrayExist(payload.attributes);
    await SubTypeGroupRepository.findGroupById(payload.group);
    const subTypeResult = await SubTypeRepository.createSubTypeValue(
      subTypeModel,
      payload
    );
    return subTypeResult;
  }
  static async publishSubType(type_slug, subType_slug) {
    const type = await TypeRepository.findTypeBySlug(type_slug);
    const subTypeModel = global.subTypeSchemasMap.get(type_slug);
    const subTypeValue = await SubTypeRepository.findSubTypeBySlug(
      subType_slug,
      subTypeModel
    );
    if (subTypeValue.is_published)
      throw new BadRequestError("Sub Type is already published");
    const subType = subTypeValue.type;
    if (type.subTypes.includes(subType))
      throw new BadRequestError(`${subType} is already in ${type.name}`);
    const addResult = await TypeRepository.pushSubType(type._id, subType);
    await SubTypeRepository.publishSubType(subTypeModel, subTypeValue._id);
    return addResult;
  }
  static async draftSubType(type_slug, subType_slug) {
    const type = await TypeRepository.findTypeBySlug(type_slug);
    const subTypeModel = global.subTypeSchemasMap.get(type_slug);
    const subTypeValue = await SubTypeRepository.findSubTypeBySlug(
      subType_slug,
      subTypeModel
    );
    if (subTypeValue.is_draft)
      throw new BadRequestError("Sub Type is already draft");
    const subType = subTypeValue.type;
    if (!type.subTypes.includes(subType))
      throw new BadRequestError(`${type.name} is not contain in ${subType}`);
    await TypeRepository.pullSubType(type._id, subType);
    await SubTypeRepository.draftSubType(subTypeModel, subTypeValue._id);
    return await ProductRepository.draftRangeProductBySubType(
      subTypeValue.slug
    );
  }
  static async removeSubType(type_slug, subType_slug) {
    const type = await TypeRepository.findTypeBySlug(type_slug);
    const subTypeModel = global.subTypeSchemasMap.get(type_slug);
    const subTypeValue = await SubTypeRepository.findSubTypeBySlug(
      subType_slug,
      subTypeModel
    );
    const subType = subTypeValue.type;
    if (!type.subTypes.includes(subType))
      throw new BadRequestError(`${type.name} is not contain in ${subType}`);
    await TypeRepository.pullSubType(type._id, subType);
    await SubTypeRepository.removeSubType(subTypeModel, subTypeValue._id);
    return await ProductRepository.removeRangeProductBySubType(
      subTypeValue.slug
    );
  }
  static async getAllSubTypes() {
    global.subTypeSchemasMap = global.subTypeSchemasMap || new Map();
    const types = await TypeRepository.getPublishedTypes();
    for (const type of types) {
      if (!global.subTypeSchemasMap.has(type.slug)) {
        const SubType = generateSubTypeSchema(type);
        global.subTypeSchemasMap.set(type.slug, SubType);
      }
    }
    return global.subTypeSchemasMap;
  }
  static async editSubTypeName(type_id, subType_id, name) {
    const type = await TypeRepository.findTypeById(type_id);
    const typeSchema = global.subTypeSchemasMap.get(type.name);
    const isUse = type.subTypes.includes(name);
    if (isUse) throw new BadRequestError(`${name} is already in use!`);
    type.subTypes = type.subTypes.filter((p) => p !== name);
    type.subTypes.push(name);
    await Promise.all([
      SubTypeRepository.editSubTypeName(subType_id, typeSchema, name),
      TypeRepository.editType(type),
    ]);
  }
  static async editSubType(type_id, subType_id, description, thumb) {
    const type = await TypeRepository.findTypeById(type_id);
    const typeSchema = global.subTypeSchemasMap.get(type.name);
    await SubTypeRepository.editSubType(
      subType_id,
      typeSchema,
      description,
      thumb
    );
  }
  static async getSubTypeDetail(slug, type_slug) {
    const typeSchema = global.subTypeSchemasMap.get(type_slug);
    let subtype = await SubTypeRepository.findSubTypeBySlug(slug, typeSchema);
    return subtype;
  }
  static async getAttributeBySubType(typeModel, listSlug) {
    const set = new Set();
    let resultArray = [];
    await Promise.all(
      listSlug.map(async (slug) => {
        let subType = await SubTypeRepository.findSubTypeBySlug(
          slug,
          typeModel
        );
        if (!subType) throw new BadRequestError(`Cannot Find SubType ${slug}`);
        subType.attributes.forEach((attribute) => {
          const key = JSON.stringify(attribute);
          if (!set.has(key)) {
            set.add(key);
            resultArray.push(attribute);
          }
        });
      })
    );
    return resultArray;
  }
  static async getDrafSubTypes() {
    let subTypes = [];
    let arrayOfModel = Array.from(global.subTypeSchemasMap);
    if (arrayOfModel.length === 0) return [];
    await Promise.all(
      arrayOfModel.map(async (model) => {
        let subtypeList = await SubTypeRepository.getDraftSubType(model[1]);
        subTypes.push(...subtypeList);
      })
    );
    return subTypes;
  }
  static async getPublishSubTypes() {
    let subTypes = [];
    let arrayOfModel = Array.from(global.subTypeSchemasMap);
    if (arrayOfModel.length === 0) return [];
    await Promise.all(
      arrayOfModel.map(async (model) => {
        let subtypeList = await SubTypeRepository.getPublishSubType(model[1]);
        subTypes.push(...subtypeList);
      })
    );
    return subTypes;
  }
  static async getAll() {
    let subTypes = [];
    let arrayOfModel = Array.from(global.subTypeSchemasMap);
    if (arrayOfModel.length === 0) return [];
    await Promise.all(
      arrayOfModel.map(async (model) => {
        let subtypeList = await SubTypeRepository.getAllSubType(model[1]);
        subTypes.push(...subtypeList);
      })
    );
    return subTypes;
  }
}

module.exports = SubTypeService;
