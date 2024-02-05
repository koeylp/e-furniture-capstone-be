const AttributeRepository = require("../models/repositories/attributeRepository");
const SubTypeRepository = require("../models/repositories/subTypeRepository");
const TypeRepository = require("../models/repositories/typeRepository");
const { generateSubTypeSchema } = require("../models/subTypeModel");
const { BadRequestError } = require("../utils/errorHanlder");

class SubTypeService {
  static async addSubType(
    type_id,
    subType,
    description,
    thumb,
    attributes = []
  ) {
    const type = await TypeRepository.findTypeById(type_id);
    const subTypeModel = global.subTypeSchemasMap.get(type.slug);
    if (!subTypeModel) throw new BadRequestError("Type is not in use!");
    if (type.subTypes.includes(subType))
      throw new BadRequestError(`${subType} is already in ${type.name}`);
    await AttributeRepository.checkArrayExist(attributes);
    const subTypeResult = await SubTypeRepository.createSubTypeValue(
      subTypeModel,
      subType,
      description,
      thumb,
      attributes
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

    subTypeValue.is_draft = false;
    subTypeValue.is_published = true;
    await SubTypeRepository.updateSubType(subTypeModel, subTypeValue);
    return addResult;
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
    return await SubTypeRepository.findSubTypeBySlug(slug, typeSchema);
  }
}

module.exports = SubTypeService;
