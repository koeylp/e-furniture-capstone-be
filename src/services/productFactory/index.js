const { default: mongoose } = require("mongoose");
const {
  _Product,
  _Sofa,
  _Armchair,
  _Chair,
} = require("../../models/productModel");
const {
  InternalServerError,
  BadRequestError,
} = require("../../utils/errorHanlder");
const { returnSofaSubTypeMap } = require("./enum");
const { validateSubType } = require("./validateSubType");
const Repository = require("../../models/Repository/repository");
class Product {
  constructor({
    name,
    thumb,
    price,
    type,
    variation,
    width,
    height,
    // shop,
    // room,
    attributes,
    model3D,
    status = 0,
  }) {
    (this.name = name),
      (this.thumb = thumb),
      (this.price = price),
      (this.type = type),
      (this.variation = variation),
      (this.width = width),
      (this.height = height),
      //   (this.shop = shop),
      //   (this.room = room),
      (this.attributes = attributes),
      (this.model3D = model3D),
      (this.status = status);
  }
  async createProduct() {
    const newProduct = await _Product.create({
      ...this,
    });
    if (!newProduct) throw new InternalServerError();
    return newProduct;
  }
}
class Sofa extends Product {
  async createSubType() {
    const subType = await _Sofa.create({
      name: this.name,
      description: this.description,
      thumb: this.thumb,
      products: [],
    });
  }
  async createProduct() {
    const sofaSubType = returnSofaSubTypeMap(this.attributes.type);
    if (!sofaSubType) throw new BadRequestError();
    validateSubType(this.attributes.attributeType, sofaSubType.subTypeEnum);
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create Sofa Error!");
    let query = {
      type: sofaSubType.key,
    };
    let update = {
      $push: {
        products: newProduct._id,
      },
    };
    return await Repository.update({ query, update, MODEL: _Sofa });
  }
}

module.exports = {
  Product,
  Sofa,
};
