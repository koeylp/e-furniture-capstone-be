const SubTypeRepository = require("../../models/repositories/subTypeRepository");
const {
  InternalServerError,
  BadRequestError,
} = require("../../utils/errorHanlder");
const { validateSubType } = require("./validateSubType");
const TypeRepository = require("../../models/repositories/typeRepository");
const ProductRepository = require("../../models/repositories/productRepository");
const {
  removeUndefineObject,
  removeInsideUndefineObject,
} = require("../../utils");
class Product {
  constructor({
    name,
    thumb,
    price,
    type,
    variation = [],
    width,
    height,
    room,
    attributes = [],
    model3D,
    isDraft = true,
    isPublished = false,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.price = price;
    this.type = type;
    this.variation = variation;
    this.width = width;
    this.height = height;
    this.room = room;
    this.attributes = attributes;
    this.model3D = model3D;
    this.isDraft = isDraft;
    this.isPublished = isPublished;
  }
  async createProduct() {
    return await ProductRepository.createProduct({ ...this });
  }
  async updateProduct(product_slug, payload) {
    return await ProductRepository.updateProductBySlug(product_slug, payload);
  }
}
class TypeProduct extends Product {
  async createProduct(typeModel) {
    const type = await TypeRepository.findTypeBySlug(this.type);
    if (!type) throw new BadRequestError("Cannot Find Any Type For Adding!");
    const subType = await SubTypeRepository.findSubTypeByName(
      this.attributes.type,
      typeModel
    );
    if (!subType)
      throw new BadRequestError("Cannot Find Any Sub Type For Adding!");
    validateSubType(this.attributes.attributeType, subType.attributes);
    this.type = type._id;
    return await super.createProduct();
  }
  async updateProduct(product_slug) {
    let objectParams = removeUndefineObject(this);
    const updateProduct = await super.updateProduct(product_slug, objectParams);
    return updateProduct;
  }
}

module.exports = {
  Product,
  TypeProduct,
};
