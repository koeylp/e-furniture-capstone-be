const { BadRequestError } = require("../../utils/errorHanlder");
const { Product, Sofa } = require("./index");
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createSubType(type, payload) {
    if (type === "Product") throw new BadRequestError("Cannot Create SubType!");
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid Type Product");
    return new productClass(payload).createSubType();
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError("Invalid Type Product");
    return new productClass(payload).createProduct();
  }
}

ProductFactory.registerProductType("Sofa", Sofa);
ProductFactory.registerProductType("Product", Product);

module.exports = ProductFactory;
