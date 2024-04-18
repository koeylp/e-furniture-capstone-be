const ProductRepository = require("../models/repositories/productRepository");
const SubTypeRepository = require("../models/repositories/subTypeRepository");
const TypeRepository = require("../models/repositories/typeRepository");
const storeSubType = require("../models/storeSubTypeModel");

class StoreSubTypeService {
  static async restore(type_slug) {
    const subTypeModel = global.subTypeSchemasMap.get(type_slug);
    const type = await TypeRepository.findTypeBySlug(type_slug);
    if (!subTypeModel) throw new BadRequestError("Type is not in use!");
    const subTypes = await SubTypeRepository.getSubTypesV2(subTypeModel);
    console.log(type);
    return await storeSubType.create({
      type: type_slug,
      code: type._id,
      subTypes: subTypes,
    });
  }
  static async store(type_id, subtypeModel) {
    let products = [];
    const type = await storeSubType.findOne({
      code: type_id,
    });
    type.subTypes.forEach((type) => {
      products.push(...type.products);
      subtypeModel.create(type);
    });
    const query = {
      _id: { $in: products.map((product) => product.productId) },
    };
    await ProductRepository.publishRangeProductByType(query);
  }
}
module.exports = StoreSubTypeService;
