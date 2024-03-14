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

  static async save(inventory_id, updatedSold, updatedStock) {
    const query = {
      _id: inventory_id,
    };
    const update = {
      $set: { stock: updatedStock, sold: updatedSold },
    };
    return await _Inventory.updateOne(query, update);
  }

  static async findByQueryPopulate(limit) {
    const inventories = await _Inventory
      .find({})
      .populate("product")
      .sort([["sold", -1]])
      .select(getUnSelectData(["__v"]))
      .limit(limit)
      .lean();
    return { total: inventories.length, data: inventories };
  }
  static async findAllByQueryPopulate(page, limit) {
    const skip = (page - 1) * limit;
    const inventories = await _Inventory
      .find({})
      .populate("product")
      .sort([["createdAt", -1]])
      .select(getUnSelectData(["__v"]))
      .skip(skip)
      .limit(limit)
      .lean();
    return { total: inventories.length, data: inventories };
  }
}
module.exports = InventoryRepository;
