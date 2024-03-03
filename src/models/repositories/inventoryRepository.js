const _Inventory = require("../inventoryModel");
const { getUnSelectData } = require("../../utils");
class InventoryRepository {
  static async createInventory(inventory) {
    const newInventory = await _Inventory.create(inventory);
    return newInventory;
  }

  static async findByQuery(query) {
    return await _Inventory
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async save(query) {
    const temp = await _Inventory.findOneAndUpdate(query);
    console.log(temp);
    return temp;
  }
}
module.exports = InventoryRepository;
