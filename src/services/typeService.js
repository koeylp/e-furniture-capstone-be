const TypeRepository = require("../models/repositories/typeRepository");
const {
  BadRequestError,
  InternalServerError,
} = require("../utils/errorHanlder");
const ProductFactory = require("../services/productFactory/factory");
const {
  generateSubTypeSchema,
  deleteSubTypeSchema,
} = require("../models/subTypeModel");
const AttributeRepository = require("../models/repositories/attributeRepository");
const SubTypeRepository = require("../models/repositories/subTypeRepository");
const ProductRepository = require("../models/repositories/productRepository");
const { removeNestedId, removeInsideUndefineObject } = require("../utils");
const { FilterSubType } = require("../utils/subTypeUtils");

class TypeService {
  static async createType(typeName, thumb, subTypes = []) {
    const checkType = await TypeRepository.existTypeName(typeName);
    if (checkType) throw new BadRequestError(`${typeName} is already in use`);
    return await TypeRepository.createType(typeName, thumb, subTypes);
  }
  static async publishType(type_slug) {
    const type = await TypeRepository.findTypeBySlug(type_slug);
    if (type.is_published)
      throw new BadRequestError("Type is already published");
    const typeCheck = await TypeRepository.existTypeName(type.name);
    if (typeCheck) throw new BadRequestError(`${type.name} is already in use!`);
    const result = await TypeRepository.publishType(type._id);
    if (result.nModified < 0)
      throw new InternalServerError("Cannot Publish Type!");
    const model = generateSubTypeSchema(type);
    if (!model) throw new InternalServerError("Cannot Publish Type!");
    ProductFactory.registerProductType(type.slug, model);
    global.subTypeSchemasMap.set(type.slug, model);
    return result;
  }
  static async draftType(type_slug) {
    const type = await TypeRepository.findTypeBySlug(type_slug);
    if (type.is_draft) throw new BadRequestError("Type is already draft");
    const result = await TypeRepository.draftType(type._id);
    if (result.nModified < 0)
      throw new InternalServerError("Cannot Draft Type!");
    await Promise.all([
      ProductFactory.unregisterProductType(type.slug),
      global.subTypeSchemasMap.delete(type.slug),
      ProductRepository.draftRangeProductByType(type._id),
    ]);
    deleteSubTypeSchema(type);
    return result;
  }
  static async editTypeName(type_id, typeName) {
    await TypeRepository.findTypeById(type_id);
    const type = await TypeRepository.existTypeName(typeName);
    if (type) throw new BadRequestError(`${typeName} is already in use`);
    return await TypeRepository.editTypeName(type_id, typeName);
  }
  static async findType(type_id) {
    return await TypeRepository.findTypeById(type_id);
  }
  static async getTypes(page = 1, limit = 12) {
    return await TypeRepository.getTypes(page, limit);
  }
  static async getPublishedType(page = 1, limit = 12) {
    return await TypeRepository.getPublishedTypes(page, limit);
  }
  static async getUnPublishedType(page = 1, limit = 12) {
    return await TypeRepository.getUnPublishedTypes(page, limit);
  }
  static async getSubTypeByType(type_slug) {
    const subTypeModel = global.subTypeSchemasMap.get(type_slug);
    if (!subTypeModel) throw new BadRequestError("Type is not in use!");
    let subTypes = await SubTypeRepository.getSubTypesWithoutPopulate(
      subTypeModel
    );
    const groupedItems = FilterSubType(subTypes);
    // subTypes.forEach((item) => {
    //   const group = item.group.label;
    //   if (!groupedItems[group]) {
    //     groupedItems[group] = [];
    //   }
    //   groupedItems[group].push(item);
    // });
    return groupedItems;
  }
  static async removeType(type_id) {}
}
module.exports = TypeService;
