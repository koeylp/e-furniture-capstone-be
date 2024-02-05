const WareHouseRepository = require("../models/repositories/warehouseRepository");
const ProductRepository = require("../models/repositories/productRepository");
const { BadRequestError } = require("../utils/errorHanlder");
const { removeUndefineObject } = require("../utils");
class WareHouseService {
  static async createWareHouse(product_id, location, stock) {
    const product = await ProductRepository.findProductById(product_id);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Create WareHouse!");
    if (!product.is_published)
      throw new BadRequestError("Cannot Create WareHouse With Draft Product!");
    if (stock <= 0)
      throw new BadRequestError("Quantity must be greater than 0");
    return await WareHouseRepository.createWareHouse(
      product_id,
      location,
      stock
    );
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
}
module.exports = WareHouseService;
