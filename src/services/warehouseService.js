const WareHouseRepository = require("../models/repositories/warehouseRepository");
const ProductRepository = require("../models/repositories/productRepository");
const { BadRequestError, NotFoundError } = require("../utils/errorHanlder");
const {
  removeUndefineObject,
  checkValidId,
  generateVariations,
} = require("../utils");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const { getCode, getCodeByOneProperty } = require("../utils/codeUtils");
const ProductService = require("./productService");
const NotificationEfurnitureService = require("./NotificationEfurnitureService");

class WareHouseService {
  static async createWareHouse(payload) {
    return await WareHouseRepository.createWareHouse(payload);
  }

  static async getWareHouse(page = 1, limit = 12) {
    return await WareHouseRepository.getWareHouse(page, limit);
  }

  static async findWareHouseByProduct(product_id) {
    const product = await ProductRepository.findProductById(product_id);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Create WareHouse");
    return await WareHouseRepository.findWareHouseByProduct(product_id);
  }

  static async findWareHouseById(warehouse_id) {
    const warehouse = await WareHouseRepository.findFirst();
    return warehouse;
  }

  static async findWareHouse() {
    const warehouse = await WareHouseRepository.findByQuery({});
    if (!warehouse) throw new NotFoundError("WareHouse Not Found");
    return warehouse;
  }

  static async updateWareHouse(payload) {
    const warehouse = await WareHouseRepository.findFirst();
    const update = removeUndefineObject(payload);
    return await WareHouseRepository.updateWareHouse(
      warehouse._id.toString(),
      update
    );
  }

  static async removewWareHouse(warehouse_id) {
    return await WareHouseRepository.removeWareHouse(warehouse_id);
  }

  static async addProductToWareHouse(warehouse_id, products) {
    const warehouse = await WareHouseRepository.findByQuery({
      _id: warehouse_id,
    });
    if (!warehouse)
      throw new NotFoundError(`Warehouse not found with id ${warehouse_id}`);

    for (let product of products) {
      const code = await getCode(product.product, product.variation);
      let foundProduct = await ProductRepository.findProductById(
        product.product
      );
      if (!foundProduct)
        throw new BadRequestError(
          "Cannot Find Any Product To Create WareHouse!"
        );
      if (!foundProduct.is_published)
        throw new BadRequestError(
          "Cannot Create WareHouse With Draft Product!"
        );
      if (product.stock <= 0)
        throw new BadRequestError("Quantity must be greater than 0");
      const index = warehouse.products.findIndex((el) => el.code === code);
      if (index === -1) {
        product.code = code;
        warehouse.products.push(product);
      } else warehouse.products[index].stock += product.stock;

      const inventory = await InventoryRepository.findByQuery({
        code: code,
      });
      if (!inventory) {
        product.code = code;
        await InventoryRepository.createInventory(product);
      } else {
        inventory.stock += product.stock;
        await InventoryRepository.save(
          inventory._id,
          inventory.sold,
          inventory.stock
        );
      }
    }
    const result = await WareHouseRepository.save(warehouse);

    return result;
  }

  static async updateProductStock(product, stock) {
    const { foundWarehouse, product_index } =
      await this.findProductInFirstWareHouse(product);
    this.validateStock(product.stock);
    foundWarehouse.products[product_index].stock = stock;
    await this.checkLowStockQuantity(foundWarehouse.products[product_index]);
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async increaseProductStock(product, stock) {
    const { foundWarehouse, product_index } =
      await this.findProductInFirstWareHouse(product);
    this.validateStock(stock);
    foundWarehouse.products[product_index].stock += stock;
    await this.checkLowStockQuantity(foundWarehouse.products[product_index]);
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async decreaseProductStock(product, stock) {
    const { foundWarehouse, product_index } =
      await this.findProductInFirstWareHouse(product);
    this.validateStock(stock);
    let updatedStock = foundWarehouse.products[product_index].stock - stock;

    foundWarehouse.products[product_index].stock =
      updatedStock < 0 ? 0 : updatedStock;

    await this.checkLowStockQuantity(foundWarehouse.products[product_index]);

    return await WareHouseRepository.save(foundWarehouse);
  }

  // static async descreaseProductStock(product){
  //   const { foundWarehouse, product_index } =
  //     await this.findProductInFirstWareHouse(product);
  //   if (product.stock < 0) throw new BadRequestError("Stock value is invalid!");
  //   foundWarehouse.products[product_index].stock =
  //     foundWarehouse.products[product_index].stock - product;
  //   await this.checkLowStockQuantity(foundWarehouse.products[product_index]);
  //   return await WareHouseRepository.save(foundWarehouse);
  // }

  static async increaseProductSold(product, quantity) {
    const { foundWarehouse, product_index } =
      await this.findProductInFirstWareHouse(product);
    this.validateStock(quantity);
    foundWarehouse.products[product_index].sold += quantity;
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async decreaseProductSold(product, quantity) {
    const { foundWarehouse, product_index } =
      await this.findProductInFirstWareHouse(product);
    this.validateStock(quantity);
    let updatedStock = foundWarehouse.products[product_index].sold - quantity;
    foundWarehouse.products[product_index].sold =
      updatedStock < 0 ? 0 : updatedStock;
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async UpdateIsLowStockNotification(product) {
    const { foundWarehouse, product_index } =
      await this.findProductInFirstWareHouse(product);
    foundWarehouse.products[product_index].isNoti = product.isNoti;
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async updateLowStockValueInWarehouse(product) {
    const { foundWarehouse, product_index } =
      await this.findProductInFirstWareHouse(product);
    this.validateStock(product.stock);
    foundWarehouse.products[product_index].lowStock = product.lowStock;
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async findProductInWareHouse(warehouse_id, product) {
    const foundWarehouse = await WareHouseRepository.findByQuery({
      _id: warehouse_id,
    });

    if (!foundWarehouse)
      throw new NotFoundError("Warehouse not found with id " + warehouse_id);

    const product_index = foundWarehouse.products.findIndex(
      (el) => el.product.toHexString() === product.product
    );

    return { foundWarehouse, product_index };
  }

  static async findProductInFirstWareHouse(product) {
    const foundWarehouse = await WareHouseRepository.findFirst();

    if (!foundWarehouse) throw new NotFoundError("Warehouse not found");
    const product_index = foundWarehouse.products.findIndex(
      (el) => el.code === product.code
    );
    if (product_index === -1) throw new NotFoundError("Cannot Found Product!");
    return { foundWarehouse, product_index };
  }

  static async removeProductInWareHouse(warehouse_id, code) {
    checkValidId(warehouse_id);
    let [warehouse, inventory] = await Promise.all([
      WareHouseRepository.findByQuery({
        _id: warehouse_id,
      }),
      InventoryRepository.findByQuery({
        code: code,
      }),
    ]);

    if (!warehouse)
      throw new NotFoundError(`Warehouse not found with id ${warehouse_id}`);

    if (!inventory)
      throw new NotFoundError(`Inventory not found with code ${code}`);

    const product_index = warehouse.products.findIndex(
      (product) => product.code == code
    );

    if (product_index == -1)
      throw new NotFoundError("Product Is Not In WareHouse");

    let number = warehouse.products[product_index].stock;

    warehouse.products.splice(product_index, 1);

    const [warehouseResult, invenResult] = await Promise.all([
      WareHouseRepository.save(warehouse),
      InventoryRepository.decreaseStockByCode(code, number),
    ]);

    return warehouseResult;
  }

  static async getProductInsideWarehouse(product_id) {
    const warehouse = await WareHouseRepository.findFirst();
    if (!warehouse) throw new NotFoundError("Cannot Found Any WareHouse!");

    const products = warehouse.products
      .filter((product) => product.product._id.toString() === product_id)
      .map(async (product) => {
        let variation = await ProductService.findVariationValues(
          product.product._id.toString(),
          product.variation
        );
        product.variation = variation == null ? product.variation : variation;
        return product;
      });

    return await Promise.all(products);
  }

  static async getProductAndWareHouseValue(product_id) {
    const [product, warehouse] = await Promise.all([
      ProductRepository.findProductByIdWithoutState(product_id),
      WareHouseRepository.findByQuery({}),
    ]);

    if (!warehouse) {
      throw new NotFoundError(`Warehouse not found`);
    }
    if (!product) {
      throw new NotFoundError(`Product not found`);
    }
    return { product, warehouse };
  }

  static async addItemToWareHouse(productInput) {
    const { product, warehouse } = await this.getProductAndWareHouseValue(
      productInput._id.toString()
    );

    const variationCombinations = await this.combineVariations(product);

    const variations = await this.filterProductVariationsNotInWareHouse(
      variationCombinations,
      product._id.toString(),
      warehouse
    );
    if (variations.length > 0) {
      variations.forEach(async (item) => {
        let data = {
          product: product._id,
          variation: item.variation,
          code: item.code,
        };
        warehouse.products.push(data);
        const inventory = await InventoryRepository.findByQuery({
          code: item.code,
        });
        if (!inventory) await InventoryRepository.createInventory(data);
      });
      await WareHouseRepository.save(warehouse);
    }
  }

  static async removeItemFromWareHouse(productInput, property_id) {
    const { product, warehouse } = await this.getProductAndWareHouseValue(
      productInput._id.toString()
    );
    const code = await getCodeByOneProperty(
      productInput._id.toString(),
      property_id
    );
    const productIndex = warehouse.products.findIndex(
      (warehouseProduct) => warehouseProduct.code === code
    );

    if (productIndex !== -1) {
      warehouse.products.splice(productIndex, 1);
    }
    await WareHouseRepository.save(warehouse);
    return code;
  }

  static async filterProductVariationsNotInWareHouse(
    variations,
    product_id,
    warehouse
  ) {
    const results = await Promise.all(
      variations.map(async (variation) => {
        const code = await getCode(product_id, variation);
        const shouldInclude =
          warehouse.products.findIndex((el) => el.code === code) === -1;
        return shouldInclude ? { variation, code } : null;
      })
    );
    return results.filter((item) => item !== null);
  }

  static async combineVariations(product) {
    const variations = product.variation.map((variation) =>
      variation.properties.map((property) => ({
        variation_id: variation._id.toString(),
        property_id: property._id.toString(),
      }))
    );

    return generateVariations(variations);
  }

  static async checkLowStockQuantity(product) {
    let lowStock = product.lowStock;
    let isNoti = product.isNoti;
    if (isNoti && product.stock <= lowStock) {
      await NotificationEfurnitureService.notiLowStock(product.product.name);
    }
  }
  static validateStock(stock) {
    if (stock < 0) throw new BadRequestError("Stock value is invalid!");
  }
}
module.exports = WareHouseService;

// const code = await getCode(product._id.toString(), property);

//       const index = warehouse.products.findIndex((el) => el.code === code);

//       if (index !== -1) continue;

//       let item = {
//         product: product._id,
//         variation: property,
//         code: code,
//       };
//       warehouse.products.push(item);

//       const inventory = await InventoryRepository.findByQuery({
//         code: code,
//       });
//       if (!inventory) {
//         product.code = code;
//         await InventoryRepository.createInventory(product);
//       }
