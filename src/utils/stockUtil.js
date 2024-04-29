const WarehouseRepository = require("../models/repositories/warehouseRepository");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("./errorHanlder");
const { getMapData } = require("./mapDataUtils");
const ProductInventory = require("../models/repositories/productRepository");
const NotificationEfurnitureService = require("../services/NotificationEfurnitureService");
const ProductRepository = require("../models/repositories/productRepository");

class StockUtil {
  static async checkProductStock(product) {
    const { product_id, quantity, code, variation } = product;
    const query = { code: code };
    const productOrder = await ProductRepository.findProductById(product_id);
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

    return {
      name: productOrder.name,
      thumbs: productOrder.thumbs,
      regular_price: productOrder.regular_price,
      variation: variation,
    };
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
    variation = await ProductRepository.findVariationValues(
      product_id,
      variation
    );
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

      let nearestWarehouse = await StockUtil.findNearestWarehouse(
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
        nearestWarehouse = this.updateStockInsideItem(
          nearestWarehouse,
          quantity,
          product_index
        );

        warehouse = this.updateResultWarehouse(
          warehouse,
          nearestWarehouse._id,
          productForOrder,
          quantity
        );

        quantity = 0;
      } else {
        let quantityUpdate =
          quantity - nearestWarehouse.products[product_index].stock;

        quantity = quantityUpdate;

        warehouse = this.updateResultWarehouse(
          warehouse,
          nearestWarehouse._id,
          productForOrder,
          nearestWarehouse.products[product_index].stock
        );

        nearestWarehouse = this.updateStockInsideItem(
          nearestWarehouse,
          nearestWarehouse.products[product_index].stock,
          product_index
        );
      }
      await this.checkLowStockQuantity(
        nearestWarehouse.products[product_index]
      );
      await WarehouseRepository.save(nearestWarehouse);
    }
    return warehouse;
  }

  static updateResultWarehouse(
    warehouse,
    id,
    productForOrder,
    variation,
    stock
  ) {
    warehouse.push({
      warehouse_id: id,
      products: {
        name: productForOrder.name,
        variation: variation,
        thumbs: productForOrder.thumbs,
        quantity: stock,
      },
    });
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

  static async restoreInventoryStock(product) {
    const { product_id, quantity, code } = product;
    const query = { code: code };
    const foundInventory = await InventoryRepository.findByQuery(query);
    if (!foundInventory) return;
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

  static async modifyStock() {
    const result = {};
    const products = order.order_products;
    for (const product of products) {
      await this.updateInventoryStock(product);
    }
  }

  static async modifyInventoryStock() {}

  static updateStockInsideItem(warehouse, quantity, product_index) {
    warehouse.products[product_index].stock -= quantity;
    warehouse.products[product_index].sold += quantity;
    return warehouse;
  }

  static draftProduct(warehouse, product_index) {
    warehouse.products[product_index].is_draft = true;
    warehouse.products[product_index].is_published = false;
    return warehouse;
  }
}

module.exports = StockUtil;
