const InventoryRepository = require("../models/repositories/inventoryRepository");
const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
class InventoryService {
  static async create(inventory) {
    return InventoryRepository.createInventory(inventory);
  }

  static async findInventoryByCode(code) {
    const inventory = await InventoryRepository.findByQuery({
      code: code,
    });
    if (!inventory)
      throw new NotFoundError("Inventory not found with specific product");
    return inventory;
  }

  static async updateInventoryStock(product) {
    const inventory = await this.findInventoryByCode(product.code);
    this.validateStock(product.stock);
    inventory.stock = product.stock;
    return this.updateInventory(inventory);
  }

  static async updateInventorySold(product) {
    const inventory = await this.findInventoryByCode(product.code);
    this.validateStock(product.stock);
    inventory.sold += product.stock;
    return this.updateInventory(inventory);
  }

  static async updateInventory(inventory) {
    return await InventoryRepository.save(
      inventory._id,
      inventory.sold,
      inventory.stock
    );
  }

  static async removeInventory(code) {
    return await InventoryRepository.removeInventoryByCode(code);
  }

  static validateStock(stock) {
    if (stock < 0) throw new BadRequestError("Stock value is invalid!");
  }
}
module.exports = InventoryService;
