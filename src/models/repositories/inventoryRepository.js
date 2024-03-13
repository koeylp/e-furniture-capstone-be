const _Inventory = require("../inventoryModel");
const { getUnSelectData } = require("../../utils");
class InventoryRepository {
  static async createInventory(inventory) {
    const newInventory = await _Inventory.create(inventory);
    return newInventory;
  }
  static async getInventory(query) {
    return await _Inventory.find(query).populate("product").lean();
  }
  static async findByQuery(query) {
    return await _Inventory
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async save(inventory_id, updatedStock) {
    const query = {
      _id: inventory_id,
    };
    const update = {
      $set: { stock: updatedStock },
    };
    return await _Inventory.updateOne(query, update);
  }
}
module.exports = InventoryRepository;
