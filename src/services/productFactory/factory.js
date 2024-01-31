const SubTypeService = require("../../services/subTypeService");
const { TypeProduct } = require("../../services/productFactory/index");
const { BadRequestError } = require("../../utils/errorHanlder");
const ProductRepository = require("../../models/repositories/productRepository");
const { returnSortType } = require("./sortType");
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
  static async getProductsByType(type) {}

  static async getAllDraft(page = 1, limit = 12, sortType = "default") {
    sortType = returnSortType(sortType);
    return await ProductRepository.getAllDraft(page, limit, sortType);
  }

  static async getAllPublished(page = 1, limit = 12, sortType = "default") {
    sortType = returnSortType(sortType);
    return await ProductRepository.getAllPublished(page, limit, sortType);
  }
}
ProductFactory.registerSubTypesFromMap();
module.exports = ProductFactory;
