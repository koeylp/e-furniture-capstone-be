const WareHouseRepository = require("../models/repositories/warehouseRepository");
const ProductRepository = require("../models/repositories/productRepository");
const { BadRequestError, NotFoundError } = require("../utils/errorHanlder");
const { removeUndefineObject } = require("../utils");
const InventoryRepository = require("../models/repositories/inventoryRepository");
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
    return await WareHouseRepository.findWareHouseById(warehouse_id);
  }
  static async updateWareHouse(warehouse_id, payload) {
    await WareHouseRepository.findWareHouseById(warehouse_id);
    if (payload.stock && payload.stock < 0)
      throw new BadRequestError("Quantity must be greater than 0");
    const update = removeUndefineObject(payload);
    return await WareHouseRepository.updateWareHouse(warehouse_id, update);
  }
  static async removewWareHouse(warehouse_id) {
    return await WareHouseRepository.removeWareHouse(warehouse_id);
  }
  static async addProductToWareHouse(warehouse_id, product) {
    const warehouse = await this.findWareHouseById(warehouse_id);
    if (!warehouse)
      throw new NotFoundError(`Warehouse not found with id ${warehouse_id}`);
    const foundProduct = await ProductRepository.findProductById(
      product.product
    );
    if (!foundProduct)
      throw new BadRequestError("Cannot Find Any Product To Create WareHouse!");
    if (!foundProduct.is_published)
      throw new BadRequestError("Cannot Create WareHouse With Draft Product!");
    if (product.stock <= 0)
      throw new BadRequestError("Quantity must be greater than 0");
    const index = warehouse.products.findIndex(
      (el) => el.product.toHexString() === product.product
    );
    console.log(warehouse.products[index]);
    if (index === -1) warehouse.products.push(product);
    else warehouse.products[index].stock += product.stock;
    const inventory = await InventoryRepository.findByQuery({
      product: product.product,
    });
    if (!inventory)
      throw new NotFoundError(
        `Inventory not found with product ${product.product}`
      );
    inventory.stock += product.stock;
    await InventoryRepository.save(inventory._id, inventory.stock);
    return await WareHouseRepository.save(warehouse);
  }
}
module.exports = WareHouseService;
