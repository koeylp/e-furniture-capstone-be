const ProductRepository = require("../models/repositories/productRepository");
const SubTypeRepository = require("../models/repositories/subTypeRepository");
const { BadRequestError, NotFoundError } = require("../utils/errorHanlder");
const ProductFactory = require("./productFactory/factory");
const { returnSortType } = require("./productFactory/sortType");
const {
  getProducts,
  getProductsBySubType,
} = require("../utils/skipLimitForProduct");
const TypeRepository = require("../models/repositories/typeRepository");
const SubTypeService = require("./subTypeService");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const WareHouseRepository = require("../models/repositories/warehouseRepository");
const CartRepository = require("../models/repositories/cartRepository");
const WishlistRepositoy = require("../models/repositories/wishlistRepository");
const FlashSaleRepository = require("../models/repositories/flashSaleRepository");
const FlashSaleUtils = require("../utils/flashSaleUtils");
const { default: mongoose } = require("mongoose");

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
    const product = await ProductRepository.findProductBySlug(slug);
    if (!product.is_published)
      throw new NotFoundError("Cannot Found Any Products!");
    return product;
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
    await InventoryRepository.publishInventoryByProduct(product._id);
    await WareHouseRepository.publishProductInsideWareHouse(product._id);

    return product;
  }
  static async getProductsByType(
    page = 1,
    limit = 12,
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
  static async getProductsBySubType(page = 1, limit = 12, type_slug, slug) {
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
    // if (product.is_draft)
    //   throw new BadRequestError("Product is already Draft!");
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
    await InventoryRepository.deleteInventoryByProduct(product._id);
    await WareHouseRepository.deleteProductInsideWareHouse(product._id);
    await CartRepository.deleteProductInCart(product._id);
    await WishlistRepositoy.deleteProductInWishList(product._id);
    return await ProductRepository.removeProduct(product._id);
  }
  static async draftProduct(type_slug, product_slug) {
    const product = await ProductRepository.findProductBySlug(product_slug);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Draft!");
    // if (product.is_draft)
    //   throw new BadRequestError("Product is already Draft!");
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
    await InventoryRepository.draftInventoryByProduct(product._id);
    await WareHouseRepository.draftProductInsideWareHouse(product._id);
    await CartRepository.deleteProductInCart(product._id);
    await WishlistRepositoy.deleteProductInWishList(product._id);
    return await ProductRepository.draftProduct(product._id);
  }
  static async updateRangeProductSalePrice(products) {
    products.forEach(async (product) => {
      let update = {
        $set: {
          sale_price: product.salePrice,
        },
      };
      await ProductRepository.updateProductById(product.productId, update);
    });
  }
  static async updateRangeProductWithOldSalePrice(products) {
    products.forEach(async (product) => {
      let update = {
        $set: {
          sale_price: product.oldSalePrice,
        },
      };
      await ProductRepository.updateProductById(product.productId, update);
    });
  }
  static async searchProductByName(text, page = 1, limit = 12) {
    let options = { is_draft: false, is_published: true };
    let filter = [];
    return ProductRepository.searchByText({
      keySearch: text,
      filter,
      options,
      page,
      limit,
    });
  }
  static async getBestSeller(limit) {
    return await InventoryRepository.findByQueryPopulate(limit);
  }
  static async getAllProducts(page, limit) {
    return await InventoryRepository.findAllByQueryPopulate(page, limit);
  }
  static async findVariationValues(product_id, variation) {
    const product = await ProductRepository.findProductById(product_id);
    const matchingVariations = product.variation.filter((item) =>
      variation.some((inside) => inside.variation_id === item._id.toString())
    );

    const result = matchingVariations.flatMap((item) =>
      item.properties
        .filter((data) =>
          variation.some((inside) => inside.property_id === data._id.toString())
        )
        .map((data) => ({
          property_id: variation.find(
            (inside) => inside.property_id === data._id.toString()
          ).property_id,
          variation_id: item._id,
          color: data.value,
          sub_price: data.sub_price,
        }))
    );

    return result;
  }
  static async getProductValidForFlashSale(startDay, endDay) {
    startDay = FlashSaleUtils.convertToDate(startDay);
    endDay = FlashSaleUtils.convertToDate(endDay);
    let query = {
      $or: [
        {
          $and: [
            { startDay: { $lte: startDay } },
            { endDay: { $gte: endDay } },
          ],
        },
        {
          $and: [
            { startDay: { $gte: startDay } },
            { endDay: { $lte: endDay } },
          ],
        },
        {
          $and: [
            { startDay: { $gte: startDay } }, //18h17 > 17h17
            { endDay: { $gte: endDay } }, //18h20 > 18h18
            { startDay: { $lte: endDay } }, //18h18 < 17h17
          ],
        },
        {
          $and: [
            { startDay: { $lte: startDay } },
            { endDay: { $lte: endDay } },
            { endDay: { $gte: startDay } },
          ],
        },
      ],
    };
    const flashsales = await FlashSaleRepository.getFlashSalesWithoutPopulate(
      query
    );
    let invalidArray = await this.getUniqueProductIds(flashsales);
    const excludedIds = invalidArray.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    query = {
      _id: { $nin: excludedIds },
      is_draft: false,
      is_published: true,
    };
    return await ProductRepository.getAllsWithoutPopulateAndStock(query);
  }

  static async getUniqueProductIds(flashsales) {
    let product_id = new Set();
    await Promise.all(
      flashsales.map(async (flashSale) => {
        await Promise.all(
          flashSale.products.map(async (product) => {
            product_id.add(product.productId);
          })
        );
      })
    );
    return Array.from(product_id);
  }
}
module.exports = ProductService;
