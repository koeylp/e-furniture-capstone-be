const { draftProduct } = require("../models/repositories/productRepository");
const WarehouseRepository = require("../models/repositories/warehouseRepository");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("./errorHanlder");
const { getMapData } = require("./mapDataUtils");

class StockUtil {
  static async checkProductStock(product) {
    const { product_id, quantity } = product;
    const query = { product: product_id };
    const foundProductStock = await InventoryRepository.findByQuery(query);
    if (!foundProductStock)
      throw new NotFoundError(`Stock not found with id + ${product_id}`);
    if (foundProductStock.stock === 0)
      throw new BadRequestError(
        `The product with id ${product_id} is out of stock`
      );
    if (foundProductStock.stock < quantity) {
      throw new BadRequestError(
        `The product with id ${product_id} must be less than or equal to ${foundProductStock.stock}`
      );
    }
  }

  static async updateWarehouseStock(product, order_shipping) {
    const { longitude, latitude } = order_shipping;
    const { product_id, quantity } = product;
    const foundWarehouses = await WarehouseRepository.findManyByQuery(
      product_id
    );
    const nearestWarehouse = await StockUtil.findNearestWarehouse(
      foundWarehouses,
      longitude,
      latitude
    );
    const product_index = nearestWarehouse.products.findIndex(
      (el) => el.product
    );
    nearestWarehouse.products[product_index].stock -= quantity;
    return await WarehouseRepository.save(nearestWarehouse);
  }

  static async findNearestWarehouse(warehouses, longitude, latitude) {
    let nearestWarehouse = {};
    let nearest_distance = Infinity;
    for (let warehouse of warehouses) {
      let mapDataDistance2Point = await getMapData(
        `${warehouse.longitude},${warehouse.latitude};${longitude},${latitude}`
      );
      let temp_distance = mapDataDistance2Point.routes[0].distance;
      if (temp_distance < nearest_distance) {
        nearestWarehouse = warehouse;
        nearest_distance = temp_distance;
      }
    }
    return nearestWarehouse;
  }

  static async updateInventoryStock(product) {
    const { product_id, quantity } = product;
    const query = { product: product_id };
    const foundInventory = await InventoryRepository.findByQuery(query);
    const updatedStock = foundInventory.stock - quantity;
    if (updatedStock === 0) await draftProduct(product_id);
    const savedInventory = await InventoryRepository.save(
      foundInventory._id,
      updatedStock
    );
    if (!savedInventory) throw new InternalServerError();
  }
}

module.exports = StockUtil;
