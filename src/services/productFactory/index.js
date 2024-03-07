const SubTypeRepository = require("../../models/repositories/subTypeRepository");
const { BadRequestError } = require("../../utils/errorHanlder");
const { validateSubType } = require("./validateSubType");
const TypeRepository = require("../../models/repositories/typeRepository");
const ProductRepository = require("../../models/repositories/productRepository");
const { removeUndefineObject } = require("../../utils");
const SubTypeService = require("../subTypeService");
class Product {
  constructor({
    name,
    thumbs,
    description,
    regular_price,
    sale_price,
    type,
    attributes = [],
    model3D,
    isDraft = true,
    isPublished = false,
  }) {
    this.name = name;
    this.thumbs = thumbs;
    this.description = description;
    this.regular_price = regular_price;
    this.sale_price = sale_price;
    this.type = type;
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
    const product_check_name = await ProductRepository.findProductByName(
      this.name
    );
    if (product_check_name)
      throw new BadRequestError(`Product Name ${this.name} is already in use!`);
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
