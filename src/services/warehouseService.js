const WareHouseRepository = require("../models/repositories/warehouseRepository");
const ProductRepository = require("../models/repositories/productRepository");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errorHanlder");
const { removeUndefineObject } = require("../utils");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const { getCode } = require("../utils/codeUtils");
const ProductService = require("./productService");
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
    const warehouse = await WareHouseRepository.findWareHouseById(warehouse_id);
    const productPromises = warehouse.products.map(async (item) => {
      item.variation = await ProductService.findVariationValues(
        item.product._id.toString(),
        item.variation
      );
    });
    await Promise.all(productPromises);
    return warehouse;
  }
  static async updateWareHouse(warehouse_id, payload) {
    await WareHouseRepository.findWareHouseById(warehouse_id);
    const update = removeUndefineObject(payload);
    return await WareHouseRepository.updateWareHouse(warehouse_id, update);
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
  static async updateProductStockInWarehouse(warehouse_id, product) {
    const foundInventory = await InventoryRepository.findByQuery({
      code: product.code,
    });
    if (!foundInventory)
      throw new NotFoundError("Inventory not found with specific product");
    const foundWarehouse = await WareHouseRepository.findByQuery({
      _id: warehouse_id,
    });
    if (!foundWarehouse)
      throw new NotFoundError("Warehouse not found with id " + warehouse_id);
    const product_index = foundWarehouse.products.findIndex(
      (el) => el.code === product.code
    );
    foundInventory.stock -= foundWarehouse.products[product_index].stock;
    foundWarehouse.products[product_index].stock = product.stock;
    foundInventory.stock += foundWarehouse.products[product_index].stock;
    const updatedInventory = await InventoryRepository.save(
      foundInventory._id,
      foundInventory.sold,
      foundInventory.stock
    );
    if (!updatedInventory) throw new InternalServerError();
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async UpdateIsLowStockNotification(warehouse_id, product) {
    const { foundWarehouse, product_index } = await this.findProductInWareHouse(
      warehouse_id,
      product
    );
    foundWarehouse.products[product_index].isNoti = product.isNoti;
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async updateLowStockValueInWarehouse(warehouse_id, product) {
    const { foundWarehouse, product_index } = await this.findProductInWareHouse(
      warehouse_id,
      product
    );
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
}
module.exports = WareHouseService;
