const ProductFactory = require("../services/productFactory/factory");
const ProductService = require("../services/productService");
const { BadRequestError } = require("../utils/errorHanlder");
const { validateCreateProduct } = require("../utils/validation");
const { OK } = require("../utils/successHandler");
const WareHouseService = require("../services/warehouseService");
const InventoryService = require("../services/inventoryService");
const NotificationEfurnitureService = require("../services/NotificationEfurnitureService");

class ProductController {
  static async createProduct(req, res) {
    const { error } = validateCreateProduct(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    const { type } = req.body;
    const { account_id } = req.payload;
    let product = await ProductFactory.createProduct(type, req.body);
    await NotificationEfurnitureService.notiToAdmin(
      account_id,
      "Product",
      product.name,
      "Created"
    );
    return new OK({
      message: "Create Product Successfully!",
      metaData: product,
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
      metaData: await ProductService.getProductsBySubTypeV2(
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
    let product = await ProductService.publishProduct(type_slug, product_slug);
    await WareHouseService.addItemToWareHouse(product);
    return new OK({
      message: "Publish Product!!",
      metaData: product,
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
  static async getBestSeller(req, res) {
    const { limit } = req.query;
    return new OK({
      message: "List Of Best-seller Products!!",
      metaData: await ProductService.getBestSeller(limit),
    }).send(res);
  }
  static async getAllProducts(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of All Products!!",
      metaData: await ProductService.getAllProducts(page, limit),
    }).send(res);
  }

  static async getProductValidForFlashSale(req, res) {
    const { startDay, endDay } = req.body;
    return new OK({
      message: "List Of All Products!!",
      metaData: await ProductService.getProductValidForFlashSale(
        startDay,
        endDay
      ),
    }).send(res);
  }

  static async updateVariation(req, res) {
    const { product_id } = req.params;
    const { variation } = req.body;
    if (!product_id || !variation) throw new BadRequestError();
    let product = await ProductService.updateVariationItem(
      product_id,
      variation
    );
    await WareHouseService.addItemToWareHouse(product);
    return new OK({
      message: "Update Variation Product Successfully!!",
      metaData: product,
    }).send(res);
  }

  static async addVariation(req, res) {
    const { product_id } = req.params;
    const { variation } = req.body;
    if (!product_id || !variation) throw new BadRequestError();
    let product = await ProductService.addVariationItem(product_id, variation);
    await WareHouseService.addItemToWareHouse(product);
    return new OK({
      message: "Update Variation Product Successfully!!",
      metaData: product,
    }).send(res);
  }

  static async removeVariation(req, res) {
    const { product_id } = req.params;
    const { property_id } = req.body;
    if (!product_id || !property_id) throw new BadRequestError();
    let product = await ProductService.removeVariationItem(
      product_id,
      property_id
    );
    const code = await WareHouseService.removeItemFromWareHouse(
      product,
      property_id
    );
    await InventoryService.removeInventory(code);
    return new OK({
      message: "Update Variation Product Successfully!!",
      metaData: product,
    }).send(res);
  }

  static async getProductDetailByVariationProperty(req, res) {
    const products = req.body;
    if (!products) throw new BadRequestError();
    return new OK({
      message: "Product Data!!",
      metaData: await ProductService.getProductDetailByVariationProperty(
        products
      ),
    }).send(res);
  }
}
module.exports = ProductController;
