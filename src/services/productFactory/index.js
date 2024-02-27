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
const SubTypeService = require("../subTypeService");
class Product {
  constructor({
    name,
    thumb,
    regular_price,
    sale_price,
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
    this.regular_price = regular_price;
    this.sale_price = sale_price;
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
    const subType = await SubTypeRepository.findSubTypeBySlug(
      this.attributes.type,
      typeModel
    );
    if (!subType)
      throw new BadRequestError("Cannot Find Any Sub Type For Adding!");
    if (subType.attributes) {
      const attribute = await SubTypeService.getAttributeBySubType(
        this.type,
        this.attributes.type
      );
      validateSubType(this.attributes.attributeType, attribute);
    }
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
