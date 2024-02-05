const SubTypeService = require("../../services/subTypeService");
const { TypeProduct } = require("../../services/productFactory/index");
const { BadRequestError } = require("../../utils/errorHanlder");

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
  static async unregisterProductType(type) {
    if (ProductFactory.productRegistry[type]) {
      delete ProductFactory.productRegistry[type];
    }
  }
  static async createProduct(type, payload) {
    const typeModel = ProductFactory.productRegistry[type];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    return new TypeProduct(payload).createProduct(typeModel);
  }
  static async updateProduct(product_slug, payload) {
    return new TypeProduct(payload).updateProduct(product_slug);
  }
}
ProductFactory.registerSubTypesFromMap();
module.exports = ProductFactory;
