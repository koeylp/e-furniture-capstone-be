const InventoryRepository = require("../models/repositories/inventoryRepository");
class InventoryService {
  static async create(inventory) {
    return InventoryRepository.createInventory(inventory);
  }
}
module.exports = InventoryService;
