const { draftProduct } = require("../models/repositories/productRepository");
const WarehouseRepository = require("../models/repositories/warehouseRepository");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("./errorHanlder");
const { getMapData } = require("./mapDataUtils");
const ProductInventory = require("../models/repositories/productRepository");
const NotificationEfurnitureRepository = require("../models/repositories/notificationEfurnitureRepository");
const NotificationEfurnitureService = require("../services/NotificationEfurnitureService");
const ProductService = require("../services/productService");
const ProductRepository = require("../models/repositories/productRepository");
const LOW_QUANTITY = 10;

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
  static async updateStock(order) {
    const products = order.order_products;
    for (const product of products) {
      await this.updateWarehouseStock(product, order.order_shipping);
    }
    for (const product of products) {
      await this.updateInventoryStock(product);
    }
  }
  static async updateWarehouseStock(product, order_shipping) {
    const { longitude, latitude } = order_shipping;
    const { product_id, quantity, code } = product;

    // const foundWarehouses = await WarehouseRepository.findManyByQuery(
    //   product_id,
    //   product.quantity
    // );
    const foundWarehouses = await WarehouseRepository.findManyByProductCode(
      code,
      product.quantity
    );
    const nearestWarehouse = await StockUtil.findNearestWarehouse(
      foundWarehouses,
      longitude,
      latitude
    );
    if (!nearestWarehouse)
      throw NotFoundError("Cannot find neareast warehouse");
    const product_index = nearestWarehouse.products.findIndex(
      (el) => el.product.toHexString() === product_id
    );
    nearestWarehouse.products[product_index].stock -= quantity;

    await this.checkLowStockQuantity(nearestWarehouse.products[product_index]);
    if (nearestWarehouse.products[product_index].stock < 0) {
      nearestWarehouse.products[product_index].is_draft = true;
      nearestWarehouse.products[product_index].is_published = false;
    }
    return await WarehouseRepository.save(nearestWarehouse);
  }

  static async updateInventoryStock(product) {
    const { product_id, quantity, code } = product;
    const query = { code: code };
    const foundInventory = await InventoryRepository.findByQuery(query);
    const updatedStock = foundInventory.stock - quantity;
    const updatedSold = foundInventory.sold + quantity;

    if (updatedStock === 0) {
      const productToDraft = await ProductRepository.findProductById(
        product_id
      );
      await ProductService.draftProduct(
        productToDraft.type,
        productToDraft.slug
      );
    }
    const savedInventory = await InventoryRepository.save(
      foundInventory._id,
      updatedSold,
      updatedStock
    );
    if (!savedInventory) throw new InternalServerError();
  }

  static async restoreStock(order) {
    const products = order.order_products;
    for (const product of products) {
      await this.restoreInventoryStock(product);
    }
  }

  static async restoreInventoryStock(product) {
    const { product_id, quantity } = product;
    const query = { product: product_id };
    const foundInventory = await InventoryRepository.findByQuery(query);
    const updatedStock = foundInventory.stock + quantity;
    const updatedSold = foundInventory.sold - quantity;
    const savedInventory = await InventoryRepository.save(
      foundInventory._id,
      updatedSold,
      updatedStock
    );
    if (!savedInventory) throw new InternalServerError();
  }
  static async checkLowStockQuantity(product) {
    let lowStock = product.lowStock;
    let isNoti = product.isNoti;
    if (isNoti && product.stock < lowStock) {
      const productForNoti = await ProductInventory.findProductById(
        product.product
      );
      await NotificationEfurnitureService.notiLowStock(productForNoti.name);
    }
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
}

module.exports = StockUtil;
