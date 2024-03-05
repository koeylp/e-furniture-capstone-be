const ProductFactory = require("../services/productFactory/factory");
const ProductService = require("../services/productService");
const { BadRequestError } = require("../utils/errorHanlder");
const { validateCreateProduct } = require("../utils/validation");
const { OK } = require("../utils/successHandler");

class ProductController {
  static async createProduct(req, res) {
    const { error } = validateCreateProduct(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    const { type } = req.body;
    return new OK({
      message: "Create Product Successfully!",
      metaData: await ProductFactory.createProduct(type, req.body),
    }).send(res);
  }
  static async getDraftProduct(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Draft Product!",
      metaData: await ProductService.getAllDraft(page, limit, sortType),
    }).send(res);
  }
  static async getPublishedProduct(req, res) {
    const { page, limit, sortType } = req.query;
    return new OK({
      message: "List Published Product!!",
      metaData: await ProductService.getAllPublished(page, limit, sortType),
    }).send(res);
  }
  static async getProductsByType(req, res) {
    const { type_slug } = req.params;
    const { page, limit, sortType } = req.query;
    if (!type_slug) throw new BadRequestError();
    return new OK({
      message: "List Published Product!!",
      metaData: await ProductService.getProductsByType(
        page,
        limit,
        sortType,
        type_slug
      ),
    }).send(res);
  }
  static async getProductsBySubType(req, res) {
    const { type_slug, slug } = req.params;
    const { page, limit } = req.query;
    if (!type_slug || !slug) throw new BadRequestError();
    return new OK({
      message: "List Published Product!!",
      metaData: await ProductService.getProductsBySubType(
        page,
        limit,
        type_slug,
        slug
      ),
    }).send(res);
  }
  static async findProduct(req, res) {
    const { slug } = req.params;
    if (!slug) throw new BadRequestError();
    return new OK({
      message: "Product Detail!!",
      metaData: await ProductService.findProduct(slug),
    }).send(res);
  }
  static async publishProduct(req, res) {
    const { type_slug, product_slug } = req.params;
    if (!type_slug || !product_slug) throw new BadRequestError();
    return new OK({
      message: "Publish Product!!",
      metaData: await ProductService.publishProduct(type_slug, product_slug),
    }).send(res);
  }
  static async draftProduct(req, res) {
    const { type_slug, product_slug } = req.params;
    if (!type_slug || !product_slug) throw new BadRequestError();
    return new OK({
      message: "Draft Product!!",
      metaData: await ProductService.draftProduct(type_slug, product_slug),
    }).send(res);
  }
  static async updateProduct(req, res) {
    const { product_id } = req.params;
    if (!product_id) throw new BadRequestError();
    return new OK({
      message: "Update Product Successfully!!",
      metaData: await ProductFactory.updateProduct(product_id, req.body),
    }).send(res);
  }
  static async removeProduct(req, res) {
    const { product_slug } = req.params;
    if (!product_slug) throw new BadRequestError();
    return new OK({
      message: "Remove Product Successfully!!",
      metaData: await ProductService.removeProduct(product_slug),
    }).send(res);
  }
  static async searchProduct(req, res) {
    const { text } = req.params;
    if (!text) throw new BadRequestError();
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Products!!",
      metaData: await ProductService.searchProductByName(text, page, limit),
    }).send(res);
  }
}
module.exports = ProductController;
