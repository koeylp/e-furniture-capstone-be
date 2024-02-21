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
  static async draftProduct(type_slug, product_slug) {
    const typeModel = ProductFactory.productRegistry[type_slug];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    const product = await ProductRepository.findProductBySlug(product_slug);
    // if (product.is_draft)
    //   throw new BadRequestError("Product is already draft!");
    await ProductRepository.draftProduct(product._id);
    const option = ["updatedAt", "createdAt", "__v"];
    const subType = await SubTypeRepository.findSubTypeBySlug(
      product.attributes.type,
      typeModel,
      option
    );
    const subType_products = subType.products.filter(
      (p) => p.productId.toString() !== product._id.toString()
    );
    return await SubTypeRepository.updateSubTypeProducts(
      typeModel,
      subType._id,
      subType_products
    );
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
    return await ProductRepository.removeProductBySlug(product_slug);
  }
}
module.exports = ProductService;
