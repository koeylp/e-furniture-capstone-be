const SubTypeRepository = require("../../models/repositories/subTypeRepository");
const { _Product } = require("../../models/productModel");
const {
  InternalServerError,
  BadRequestError,
} = require("../../utils/errorHanlder");
const { validateSubType } = require("./validateSubType");
const TypeRepository = require("../../models/repositories/typeRepository");
class Product {
  constructor({
    name,
    thumb,
    price,
    type,
    variation,
    width,
    height,
    room,
    attributes,
    model3D,
    isDraft = true,
    isPublished = false,
  }) {
    (this.name = name),
      (this.thumb = thumb),
      (this.price = price),
      (this.type = type),
      (this.variation = variation),
      (this.width = width),
      (this.height = height),
      (this.room = room),
      (this.attributes = attributes),
      (this.model3D = model3D),
      (this.isDraft = isDraft),
      (this.isPublished = isPublished);
  }
  async createProduct() {
    const newProduct = await _Product.create({
      ...this,
    });
    if (!newProduct) throw new InternalServerError();
    return newProduct;
  }
}
class TypeProduct extends Product {
  async createProduct(typeModel) {
    const type = await TypeRepository.findTypeByName(this.type);
    if (!type) throw new BadRequestError("Cannot Find Any Type For Adding!");
    const subType = await SubTypeRepository.findSubTypeByName(
      this.attributes.type,
      typeModel
    );
    if (!subType)
      throw new BadRequestError("Cannot Find Any Sub Type For Adding!");
    validateSubType(this.attributes.attributeType, subType.attributes);
    this.type = type._id;
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create Sofa Error!");
    const result = await SubTypeRepository.addProductSubType(
      newProduct._id,
      typeModel,
      this.attributes.type
    );
    if (!result) throw new InternalServerError();
    return newProduct;
  }
}

module.exports = {
  Product,
  TypeProduct,
};
