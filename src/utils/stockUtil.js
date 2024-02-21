const { draftProduct } = require("../models/repositories/productRepository");
const WarehouseRepository = require("../models/repositories/warehouseRepository");
const { BadRequestError, NotFoundError } = require("./errorHanlder");

class StockUtil {
  static async checkProductStock(product) {
    const { product_id, location, quantity } = product;
    const query = { product_id, location };
    const foundProductStock = await WarehouseRepository.findByQuery(query);
    if (!foundProductStock) throw new NotFoundError("Stock not found!");
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

  static async updateWarehouseStock(product) {
    const { product_id, location, quantity } = product;
    const query = { product_id, location };
    const foundWarehouse = await WarehouseRepository.findByQuery(query);
    const warehouse_id = foundWarehouse._id.toHexString();
    const updatedStock = foundWarehouse.stock - quantity;
    if (updatedStock === 0) await draftProduct(product_id);
    await WarehouseRepository.updateWareHouse(warehouse_id, {
      stock: updatedStock,
    });
  }
}

module.exports = StockUtil;
