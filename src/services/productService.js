const ProductRepository = require("../models/repositories/productRepository");
const SubTypeRepository = require("../models/repositories/subTypeRepository");
const { BadRequestError } = require("../utils/errorHanlder");
const ProductFactory = require("./productFactory/factory");
const { returnSortType } = require("./productFactory/sortType");
const {
  getProducts,
  getProductsBySubType,
} = require("../utils/skipLimitForProduct");
const TypeRepository = require("../models/repositories/typeRepository");
const SubTypeService = require("./subTypeService");

class ProductService {
  static async getAllDraft(page = 1, limit = 12, sortType = "default") {
    sortType = returnSortType(sortType);
    return await ProductRepository.getAllDraft(page, limit, sortType);
  }
  static async getAllPublished(page = 1, limit = 12, sortType = "default") {
    sortType = returnSortType(sortType);
    return await ProductRepository.getAllPublished(page, limit, sortType);
  }
  static async findProduct(slug) {
    return await ProductRepository.findProductBySlug(slug);
  }
  static async publishProduct(type_slug, product_slug) {
    const typeModel = ProductFactory.productRegistry[type_slug];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    const product = await ProductRepository.findProductBySlug(product_slug);
    if (product.is_published)
      throw new BadRequestError("Product is already published!");
    await ProductRepository.publishProduct(product._id);
    let product_SubType = product.attributes.type;
    product_SubType.map(async (type) => {
      await SubTypeRepository.addProductSubType(
        product._id.toString(),
        typeModel,
        type
      );
    });
    return product;
  }
  static async getProductsByType(
    page = 1,
    limit = 1,
    sortType = "default",
    type_slug
  ) {
    const type = await TypeRepository.findTypeBySlug(type_slug);
    sortType = returnSortType(sortType);
    return await ProductRepository.getProductByType(
      page,
      limit,
      sortType,
      type._id
    );
  }
  static async getProductsBySubType(page = 1, limit = 1, type_slug, slug) {
    const typeModel = ProductFactory.productRegistry[type_slug];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    const subTypes = await SubTypeRepository.findSubTypeBySlugWithPopulate(
      slug,
      typeModel
    );
    const listProduct = getProductsBySubType(page, limit, subTypes);
    return listProduct.map((item) => item.productId);
  }
  static async removeProduct(product_slug) {
    const product = await ProductRepository.findProductBySlug(product_slug);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Remove!");
    const subTypeArrayOfProduct = product.attributes.type;
    const listSubType = await SubTypeService.getAll();
    listSubType.map(async (subtype) => {
      if (subTypeArrayOfProduct.includes(subtype.slug)) {
        let type = await TypeRepository.findTypeBySubType_Slug(subtype.type);
        let subTypeModel = global.subTypeSchemasMap.get(type[0].slug);
        await SubTypeRepository.pullProductId(
          subTypeModel,
          subtype.slug,
          product._id
        );
      }
    });
    return await ProductRepository.removeProduct(product._id);
  }
  static async draftProduct(type_slug, product_slug) {
    const product = await ProductRepository.findProductBySlug(product_slug);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Draft!");
    const subTypeArrayOfProduct = product.attributes.type;
    const listSubType = await SubTypeService.getAll();
    listSubType.map(async (subtype) => {
      if (subTypeArrayOfProduct.includes(subtype.slug)) {
        let type = await TypeRepository.findTypeBySubType_Slug(subtype.type);
        let subTypeModel = global.subTypeSchemasMap.get(type[0].slug);
        await SubTypeRepository.pullProductId(
          subTypeModel,
          subtype.slug,
          product._id
        );
      }
    });
    return await ProductRepository.draftProduct(product._id);
  }
}
module.exports = ProductService;
