const _Inventory = require("../inventoryModel");
const { getUnSelectData } = require("../../utils");
class InventoryRepository {
  static async createInventory(inventory) {
    const inventory = await _Inventory.create(inventory);
    return inventory;
  }

  static async findByQuery(query) {
    return await _Inventory
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async save(inventory) {
    await _Inventory.findOneAndUpdate(inventory._id, inventory);
    return inventory;
  }
}
module.exports = InventoryRepository;
