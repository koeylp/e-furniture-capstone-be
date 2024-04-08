const { defaultVariation } = require(".");
const InventoryRepository = require("../models/repositories/inventoryRepository");

class ProductUtils {
  static async modifyStockInsideProduct(item, product_id) {
    let { total, variation } = await InventoryRepository.getStockForProduct(
      product_id,
      item.variation
    );
    item.variation = variation;
    item.stock = total;
    item.select_variation = item.variation.map((item) => {
      return defaultVariation(item);
    });
    return { ...item };
  }
}
module.exports = ProductUtils;
