const SubTypeRepository = require("../../models/repositories/subTypeRepository");
const { BadRequestError } = require("../../utils/errorHanlder");
const TypeRepository = require("../../models/repositories/typeRepository");
const ProductRepository = require("../../models/repositories/productRepository");
const { removeUndefineObject } = require("../../utils");
const VariationUtils = require("../../utils/variationUtils");
const SHIPPING_AMOUNT = 50000;

class Product {
  constructor({
    name,
    thumbs,
    description,
    regular_price,
    sale_price,
    variation,
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
    this.variation = variation;
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
    if (!this.variation || this.variation.length == 0)
      throw new BadRequestError();
    if (!subType)
      throw new BadRequestError("Cannot Find Any Sub Type For Adding!");
    this.type = type._id;
    this.regular_price = this.regular_price + SHIPPING_AMOUNT;
    this.sale_price = this.sale_price + SHIPPING_AMOUNT;
    return await super.createProduct();
  }
  async updateProduct(product_slug) {
    if (this.type) {
      const typeSlug = await TypeRepository.findTypeByName(this.type);
      let subTypeModel = global.subTypeSchemasMap.get(typeSlug.slug);
      this.type = typeSlug._id;
      if (!this.attributes.type)
        throw new BadRequestError("SubType cannot be null!");
      this.attributes.type.forEach(async (type) => {
        let check = await SubTypeRepository.findSubTypeBySlug(
          type,
          subTypeModel
        );
        if (!check) throw new BadRequestError("SubType is not valid!");
      });
    }

    if (this.variation) {
      let hasDuplicates = VariationUtils.checkDuplicateProperties(
        this.variation
      );
      if (hasDuplicates) {
        throw new BadRequestError("Variation is already in use!");
      }
    }
    let objectParams = removeUndefineObject(this);
    const updateProduct = await super.updateProduct(product_slug, objectParams);
    return updateProduct;
  }
}

module.exports = {
  Product,
  TypeProduct,
};
