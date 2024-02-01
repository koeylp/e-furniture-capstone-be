const SubTypeService = require("../../services/subTypeService");
const { TypeProduct } = require("../../services/productFactory/index");
const { BadRequestError } = require("../../utils/errorHanlder");
const ProductRepository = require("../../models/repositories/productRepository");
const SubTypeRepository = require("../../models/repositories/subTypeRepository");
const { returnSortType } = require("./sortType");
const {
  getProducts,
  getProductsBySubType,
} = require("../../utils/skipLimitForProduct");

class ProductFactory {
  static productRegistry = {};
  static registerProductType(type, modelRef) {
    if (!ProductFactory.productRegistry[type])
      ProductFactory.productRegistry[type] = modelRef;
  }
  static async registerSubTypesFromMap() {
    const subTypeMap = await SubTypeService.getAllSubTypes();
    for (const [key, value] of subTypeMap.entries()) {
      if (!ProductFactory.productRegistry[key])
        ProductFactory.registerProductType(key, value);
    }
  }
  static async createProduct(type, payload) {
    const typeModel = ProductFactory.productRegistry[type];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    return new TypeProduct(payload).createProduct(typeModel);
  }
  static async getProductsByType(page = 1, limit = 1, type) {
    const typeModel = ProductFactory.productRegistry[type];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    const option = ["_id", "type", "slug", "products"];
    const subTypes = await SubTypeRepository.getSubTypes(typeModel, option);
    return getProducts(page, limit, subTypes);
  }
  static async getProductsBySubType(page = 1, limit = 1, type, slug) {
    const typeModel = ProductFactory.productRegistry[type];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    const subTypes = await SubTypeRepository.findSubTypeBySlugWithPopulate(
      slug,
      typeModel
    );
    return getProductsBySubType(page, limit, subTypes);
  }
}
ProductFactory.registerSubTypesFromMap();
module.exports = ProductFactory;
