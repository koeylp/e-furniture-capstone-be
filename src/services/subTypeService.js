const SubTypeRepository = require("../models/repositories/subTypeRepository");
const TypeRepository = require("../models/repositories/typeRepository");
const { generateSubTypeSchema } = require("../models/subTypeModel");
const { BadRequestError } = require("../utils/errorHanlder");

class SubTypeService {
  static async getAllSubTypes() {
    global.subTypeSchemasMap = global.subTypeSchemasMap || new Map();
    const types = await TypeRepository.getTypes();
    for (const type of types) {
      if (!global.subTypeSchemasMap.has(type.name)) {
        const SubType = generateSubTypeSchema(type);
        global.subTypeSchemasMap.set(type.name, SubType);
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
}

module.exports = SubTypeService;
