const TypeRepository = require("../models/Repository/typeRepository");
const { BadRequestError } = require("../utils/errorHanlder");
const ProductFactory = require("../services/productFactory/factory");
const { generateSubTypeSchema } = require("../models/subTypeModel");
const AttributeRepository = require("../models/Repository/attributeRepository");
class TypeService {
  static async createType(typeName, subTypes = []) {
    const checkType = await TypeRepository.existTypeName(typeName);
    if (checkType) throw new BadRequestError(`${typeName} is already in use`);
    const type = await TypeRepository.createType(typeName, subTypes);
    const model = generateSubTypeSchema(type);
    ProductFactory.registerProductType(type.name, model);
    global.subTypeSchemasMap.set(type.name, model);
    return type;
  }
  static async addSubType(
    type_id,
    subType,
    description,
    thumb,
    attributes = []
  ) {
    const type = await TypeRepository.findTypeById(type_id);
    if (type.subTypes.includes(subType))
      throw new BadRequestError(`${subType} is already in ${type.name}`);
    const addResult = await TypeRepository.addSubType(type_id, subType);
    const subTypeModel = global.subTypeSchemasMap.get(type.name);
    await AttributeRepository.checkArrayExist(attributes);
    await TypeRepository.createSubTypeValue(
      subTypeModel,
      subType,
      description,
      thumb,
      attributes
    );
    return addResult;
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
  static async removeType(type_id) {}
}
module.exports = TypeService;
