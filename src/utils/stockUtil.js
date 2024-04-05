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
    const { product_id, quantity, code } = product;
    const query = { code: code };
    const foundProductStock = await InventoryRepository.findByQuery(query);
    if (!foundProductStock)
      throw new NotFoundError(`Stock not found with id + ${product_id}`);
    if (foundProductStock.stock === 0)
      throw new BadRequestError(
        `The product with id ${product_id} is out of stock`
      );
    if (foundProductStock.stock < quantity) {
      throw new BadRequestError(`Product is out of stock`);
    }
    if (foundProductStock.stock > 100) return false;
    return true;
  }
  static async updateStock(order) {
    const result = {};
    const products = order.order_products;
    for (const product of products) {
      await this.updateInventoryStock(product);
    }
    for (const product of products) {
      let warehouses = await this.updateWarehouseStock(
        product,
        order.order_shipping
      );
      warehouses.map((warehouse) => {
        if (!result[warehouse.warehouse_id]) {
          result[warehouse.warehouse_id] = [warehouse.products];
        } else {
          result[warehouse.warehouse_id] = [
            ...result[warehouse.warehouse_id],
            warehouse.products,
          ];
        }
      });
    }
    const array = [];

    for (const warehouseId in result) {
      array.push({
        warehouse_id: warehouseId,
        products: result[warehouseId],
      });
    }
    return array;
  }
  static async updateWarehouseStock(product, order_shipping) {
    const { longitude, latitude } = order_shipping;
    let { product_id, quantity, code, variation } = product;
    let warehouse = [];
    let productForOrder = await ProductRepository.findProductById(product_id);
    while (quantity != 0) {
      let foundWarehouses = await WarehouseRepository.findManyByProductCode(
        code,
        quantity
      );
      if (foundWarehouses.length == 0)
        foundWarehouses = await WarehouseRepository.findManyByProductCode(
          code,
          1
        );
      if (!foundWarehouses)
        throw new BadRequestError("WareHouse Code Was Not Found");
      const nearestWarehouse = await StockUtil.findNearestWarehouse(
        foundWarehouses,
        longitude,
        latitude
      );
      if (!nearestWarehouse)
        throw NotFoundError("Cannot find neareast warehouse");
      const product_index = nearestWarehouse.products.findIndex(
        (el) => el.code === code
      );
      if (nearestWarehouse.products[product_index].stock >= quantity) {
        nearestWarehouse.products[product_index].stock -= quantity;
        await this.checkLowStockQuantity(
          nearestWarehouse.products[product_index]
        );
        if (nearestWarehouse.products[product_index].stock < 0) {
          nearestWarehouse.products[product_index].is_draft = true;
          nearestWarehouse.products[product_index].is_published = false;
        }
        warehouse.push({
          warehouse_id: nearestWarehouse._id,
          products: {
            name: productForOrder.name,
            variation: variation,
            quantity: quantity,
          },
        });
        quantity = 0;
      } else {
        let quantityUpdate =
          quantity - nearestWarehouse.products[product_index].stock;

        await this.checkLowStockQuantity(
          nearestWarehouse.products[product_index]
        );
        if (nearestWarehouse.products[product_index].stock < 0) {
          nearestWarehouse.products[product_index].is_draft = true;
          nearestWarehouse.products[product_index].is_published = false;
        }
        quantity = quantityUpdate;
        warehouse.push({
          warehouse_id: nearestWarehouse._id,
          products: {
            name: productForOrder.name,
            variation: variation,
            quantity: nearestWarehouse.products[product_index].stock,
          },
        });
        nearestWarehouse.products[product_index].stock = 0;
      }

      await WarehouseRepository.save(nearestWarehouse);
    }
    return warehouse;
  }

  static async updateInventoryStock(product) {
    const { product_id, quantity, code } = product;
    const query = { code: code };
    const foundInventory = await InventoryRepository.findByQuery(query);
    const updatedStock = foundInventory.stock - quantity;
    const updatedSold = foundInventory.sold + quantity;

    if (updatedStock <= 0) {
      console.log("Draft");
      // const productToDraft = await ProductRepository.findProductById(
      //   product_id
      // );
      // await ProductService.draftProduct(
      //   productToDraft.type,
      //   productToDraft.slug
      // );
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
