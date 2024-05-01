const ProductRepository = require("../models/repositories/productRepository");
const SubTypeRepository = require("../models/repositories/subTypeRepository");
const { BadRequestError, NotFoundError } = require("../utils/errorHanlder");
const ProductFactory = require("./productFactory/factory");
const { returnSortType } = require("./productFactory/sortType");
const { getProductsBySubType } = require("../utils/skipLimitForProduct");
const TypeRepository = require("../models/repositories/typeRepository");
const SubTypeService = require("./subTypeService");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const WareHouseRepository = require("../models/repositories/warehouseRepository");
const CartRepository = require("../models/repositories/cartRepository");
const WishlistRepositoy = require("../models/repositories/wishlistRepository");
const FlashSaleRepository = require("../models/repositories/flashSaleRepository");
const FlashSaleUtils = require("../utils/flashSaleUtils");
const { default: mongoose } = require("mongoose");
const { getCode } = require("../utils/codeUtils");
const VariationUtils = require("../utils/variationUtils");

class ProductService {
  static async getAllDraft(page = 1, limit = 200, sortType = "default") {
    sortType = returnSortType(sortType);
    return await ProductRepository.getAllDraft(page, limit, sortType);
  }
  static async getAllPublished(page = 1, limit = 200, sortType = "default") {
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
    await WareHouseRepository.publishProductInsideWareHouse(product._id);
    await InventoryRepository.publishInventoryByProduct(product._id);
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
    let data = listProduct.map((item) => item.productId);
    let total = data.length;
    return { total, data };
  }
  static async getProductsBySubTypeV2(page = 1, limit = 12, type_slug, slug) {
    const typeModel = ProductFactory.productRegistry[type_slug];
    if (!typeModel) throw new BadRequestError("Invalid Type Product");
    const subTypes = await SubTypeRepository.findSubTypeBySlugV2(
      slug,
      typeModel
    );
    let data = [
      ...new Set(
        subTypes.products.map((item) => JSON.stringify(item.productId))
      ),
    ].map((item) => JSON.parse(item));

    data = await Promise.all(
      data.map(async (product) => {
        const modifiedProduct =
          await ProductRepository.findProductByIDWithModify(product);
        product = modifiedProduct;
        return product;
      })
    );
    let total = data.length;
    return { total, data };
  }
  static async pullProductFromSubType(product) {
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
  }
  static async removeProduct(product_slug) {
    const product = await ProductRepository.findProductBySlug(product_slug);
    if (product.stock > 0)
      throw new BadRequestError(
        "A product can only be deleted if its quantity reaches a threshold of 0"
      );
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Draft!");
    await this.pullProductFromSubType(product);
    await InventoryRepository.deleteInventoryByProduct(product._id);
    await WareHouseRepository.deleteProductInsideWareHouse(product._id);
    await CartRepository.deleteProductInCart(product._id);
    await WishlistRepositoy.deleteProductInWishList(product._id);
    await ProductRepository.removeProduct(product._id);
    return product;
  }
  static async draftProduct(type_slug, product_slug) {
    const product = await ProductRepository.findProductBySlug(product_slug);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Draft!");
    if (product.is_draft)
      throw new BadRequestError("Product is already Draft!");
    await this.pullProductFromSubType(product);
    await InventoryRepository.draftInventoryByProduct(product._id.toString());
    await WareHouseRepository.draftProductInsideWareHouse(product._id);
    await CartRepository.deleteProductInCart(product._id);
    await WishlistRepositoy.deleteProductInWishList(product._id);
    return await ProductRepository.draftProduct(product._id);
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
    let { total, data } = await InventoryRepository.findByQueryPopulate(limit);
    let query = {
      _id: { $in: data },
    };
    return await ProductRepository.getAlls(query, 1, 6);
  }
  static async getAllProducts(page, limit) {
    return await InventoryRepository.findAllByQueryPopulate(page, limit);
  }
  static async findVariationValues(product_id, variation) {
    const product = await ProductRepository.findPublishProductByIDWithModify(
      product_id
    );
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
          stock: data.stock,
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

  static async updateVariationItem(product_id, variation) {
    let product = await ProductRepository.findProductById(product_id);
    if (!product) throw new BadRequestError("Cannot Find Any Product!");
    product.variation = variation;
    await ProductRepository.updateProductById(product_id, product);
    return product;
  }

  static async addVariationItem(product_id, variation) {
    let product = await ProductRepository.findProductByIdWithoutState(
      product_id
    );

    if (!product) throw new BadRequestError("Cannot Find Any Product!");

    product.variation[0].properties.push(...variation);

    let hasDuplicates = VariationUtils.checkDuplicateProperties(
      product.variation
    );

    if (hasDuplicates) {
      throw new BadRequestError("Variation is already in use!");
    }
    await ProductRepository.updateProductById(product_id, product);
    return product;
  }

  static async removeVariationItem(product_id, property_id) {
    let product = await ProductRepository.findProductByIdWithoutState(
      product_id
    );
    if (!product) throw new BadRequestError("Cannot Find Any Product!");
    if (product.variation[0].properties.length <= 1)
      throw new BadRequestError("You Cannot Remove Last Variation!");
    let index = product.variation[0].properties.findIndex(
      (property) => property._id == property_id
    );
    if (index == -1) throw new NotFoundError("Cannot Found Any Item Result!");
    product.variation[0].properties = product.variation[0].properties.splice(
      index,
      1
    );
    await ProductRepository.updateProductById(product_id, product);
    return product;
  }

  static async getProductDetailByVariationProperty(products) {
    products = JSON.parse(products);
    const productPromises = products.map(async (product, index) => {
      const foundProduct =
        await ProductRepository.findPublishProductByIDWithModify(
          product.product_id
        );
      if (!foundProduct) {
        products = products.filter((product, i) => i !== index);
      } else {
        product.product_id = foundProduct;
        product.product_id.select_variation = await this.findVariationValues(
          foundProduct._id.toString(),
          product.variation
        );
        product.product_id.quantity_in_cart = product.quantity;
        product.product_id.code = await getCode(
          foundProduct._id,
          product.variation
        );
      }
    });

    await Promise.all(productPromises);
    let productIds = [];
    for (const product of products) {
      productIds.push(product.product_id);
    }
    products = productIds;
    return products;
  }
}
module.exports = ProductService;
