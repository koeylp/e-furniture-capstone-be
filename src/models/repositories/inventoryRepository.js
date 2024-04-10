const _Inventory = require("../inventoryModel");
const {
  getUnSelectData,
  defaultVariation,
  createCode,
} = require("../../utils");
const { default: mongoose } = require("mongoose");
const ProductUtils = require("../../utils/productUtils");
class InventoryRepository {
  static async createInventory(inventory) {
    const newInventory = await _Inventory.create(inventory);
    return newInventory;
  }
  static async getInventory({
    query = {},
    page = 1,
    limit = 12,
    sortType = {},
  }) {
    const skip = (page - 1) * limit;
    let inventories = await _Inventory
      .find(query)
      // .populate("product")
      .distinct("product")
      .populate("product");
    // .skip(skip)
    // .sort(sortType)
    // .select(getUnSelectData(["__v"]))
    // .limit(limit)
    // .lean();
    console.log(inventories);
    inventories = await Promise.all(
      inventories.map(async (data) => {
        let { total, variation } = await this.getStockForProduct(
          data.product._id,
          data.product.variation
        );
        data.product.variation = variation;
        data.product.stock = total;
        data.product.select_variation = data.product.variation.map((item) =>
          defaultVariation(item)
        );
        return data;
      })
    );

    return inventories;
  }
  static async getInventoryWithDistinctProduct({
    query = {},
    page = 1,
    limit = 12,
    sortType,
  }) {
    const skip = (page - 1) * limit;
    let result = await _Inventory.aggregate([
      {
        $match: query,
      },
      // { $group: { _id: "$product", count: { $sum: 1 } } },
      { $skip: skip },
      { $limit: limit },
      { $sort: sortType },
      // {
      //   $lookup: {
      //     from: "Product",
      //     localField: "_id",
      //     foreignField: "_id",
      //     as: "product",
      //   },
      // },
      { $unwind: "$product" },
      { $project: { _id: 0, product: 1 } },
    ]);
    return result;
  }
  static async getStockForProduct(product_id, variation) {
    let totalStock = 0;
    variation = await Promise.all(
      variation.flatMap(async (item) => {
        await Promise.all(
          item.properties.map(async (property) => {
            const check = await this.findByQuery({
              code: createCode(product_id.toString(), property._id.toString()),
            });
            property.stock = check ? check.stock : 0;
            totalStock += property.stock;
          })
        );
        return item;
      })
    );
    return { total: totalStock, variation: variation };
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

  static async draftInventory(inventory_id) {
    const query = {
      _id: inventory_id,
    };
    const update = {
      $set: { is_draft: true, is_published: false },
    };
    return await _Inventory.updateOne(query, update);
  }

  static async publishInventory(inventory_id) {
    const query = {
      _id: inventory_id,
    };
    const update = {
      $set: { is_draft: false, is_published: true },
    };
    return await _Inventory.updateOne(query, update);
  }

  static async findByQueryPopulate(limit) {
    const query = {
      is_draft: false,
      is_published: true,
    };
    const sortType = { ["sold"]: -1 };
    let inventories = await this.getInventory({
      query: query,
      sortType: sortType,
    });

    return { total: inventories.length, data: inventories };
  }
  static async findAllByQueryPopulate(page, limit) {
    const inventories = await this.getInventory({ page: page, limit: limit });
    return { total: inventories.length, data: inventories };
  }
  static async draftInventoryByProduct(product_id) {
    const query = {
      product: new mongoose.Types.ObjectId(product_id),
    };
    const update = {
      $set: { is_draft: true, is_published: false },
    };
    return await _Inventory.updateMany(query, update);
  }
  static async publishInventoryByProduct(product_id) {
    const query = {
      product: new mongoose.Types.ObjectId(product_id),
    };
    const update = {
      $set: { is_draft: false, is_published: true },
    };
    return await _Inventory.updateMany(query, update);
  }
  static async deleteInventoryByProduct(product_id) {
    const query = {
      product: new mongoose.Types.ObjectId(product_id),
    };
    return await _Inventory.deleteMany(query);
  }
}
module.exports = InventoryRepository;
