const WareHouseRepository = require("../models/repositories/warehouseRepository");
const ProductRepository = require("../models/repositories/productRepository");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../utils/errorHanlder");
const {
  removeUndefineObject,
  checkValidId,
  generateVariations,
} = require("../utils");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const { getCode, getCodeWithProperty } = require("../utils/codeUtils");
const ProductService = require("./productService");
class WareHouseService {
  static async createWareHouse(payload) {
    return await WareHouseRepository.createWareHouse(payload);
  }

  static async getWareHouse(page = 1, limit = 12) {
    return await WareHouseRepository.getWareHouse(page, limit);
  }

  static async findWareHouseByProduct(product_id) {
    const product = await ProductRepository.findProductById(product_id);
    if (!product)
      throw new BadRequestError("Cannot Find Any Product To Create WareHouse");
    return await WareHouseRepository.findWareHouseByProduct(product_id);
  }

  static async findWareHouseById(warehouse_id) {
    const warehouse = await WareHouseRepository.findWareHouseById(warehouse_id);
    if (!warehouse) throw new NotFoundError("WareHouse Not Found");
    const productPromises = warehouse.products.map(async (item) => {
      item.variation = await ProductService.findVariationValues(
        item.product._id.toString(),
        item.variation
      );
    });
    await Promise.all(productPromises);
    return warehouse;
  }

  static async findWareHouse() {
    const warehouse = await WareHouseRepository.findByQuery({});
    if (!warehouse) throw new NotFoundError("WareHouse Not Found");
    return warehouse;
  }

  static async updateWareHouse(warehouse_id, payload) {
    await WareHouseRepository.findWareHouseById(warehouse_id);
    const update = removeUndefineObject(payload);
    return await WareHouseRepository.updateWareHouse(warehouse_id, update);
  }

  static async removewWareHouse(warehouse_id) {
    return await WareHouseRepository.removeWareHouse(warehouse_id);
  }

  static async addProductToWareHouse(warehouse_id, products) {
    const warehouse = await WareHouseRepository.findByQuery({
      _id: warehouse_id,
    });
    if (!warehouse)
      throw new NotFoundError(`Warehouse not found with id ${warehouse_id}`);

    for (let product of products) {
      const code = await getCode(product.product, product.variation);
      let foundProduct = await ProductRepository.findProductById(
        product.product
      );
      if (!foundProduct)
        throw new BadRequestError(
          "Cannot Find Any Product To Create WareHouse!"
        );
      if (!foundProduct.is_published)
        throw new BadRequestError(
          "Cannot Create WareHouse With Draft Product!"
        );
      if (product.stock <= 0)
        throw new BadRequestError("Quantity must be greater than 0");
      const index = warehouse.products.findIndex((el) => el.code === code);
      if (index === -1) {
        product.code = code;
        warehouse.products.push(product);
      } else warehouse.products[index].stock += product.stock;

      const inventory = await InventoryRepository.findByQuery({
        code: code,
      });
      if (!inventory) {
        product.code = code;
        await InventoryRepository.createInventory(product);
      } else {
        inventory.stock += product.stock;
        await InventoryRepository.save(
          inventory._id,
          inventory.sold,
          inventory.stock
        );
      }
    }
    const result = await WareHouseRepository.save(warehouse);

    return result;
  }

  static async updateProductStockInWarehouse(warehouse_id, product) {
    const foundInventory = await InventoryRepository.findByQuery({
      code: product.code,
    });
    if (!foundInventory)
      throw new NotFoundError("Inventory not found with specific product");
    const foundWarehouse = await WareHouseRepository.findByQuery({
      _id: warehouse_id,
    });
    if (!foundWarehouse)
      throw new NotFoundError("Warehouse not found with id " + warehouse_id);
    const product_index = foundWarehouse.products.findIndex(
      (el) => el.code === product.code
    );
    foundInventory.stock -= foundWarehouse.products[product_index].stock;
    foundWarehouse.products[product_index].stock = product.stock;
    foundInventory.stock += foundWarehouse.products[product_index].stock;
    const updatedInventory = await InventoryRepository.save(
      foundInventory._id,
      foundInventory.sold,
      foundInventory.stock
    );
    if (!updatedInventory) throw new InternalServerError();
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async UpdateIsLowStockNotification(warehouse_id, product) {
    const { foundWarehouse, product_index } = await this.findProductInWareHouse(
      warehouse_id,
      product
    );
    foundWarehouse.products[product_index].isNoti = product.isNoti;
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async updateLowStockValueInWarehouse(warehouse_id, product) {
    const { foundWarehouse, product_index } = await this.findProductInWareHouse(
      warehouse_id,
      product
    );
    foundWarehouse.products[product_index].lowStock = product.lowStock;
    return await WareHouseRepository.save(foundWarehouse);
  }

  static async findProductInWareHouse(warehouse_id, product) {
    const foundWarehouse = await WareHouseRepository.findByQuery({
      _id: warehouse_id,
    });

    if (!foundWarehouse)
      throw new NotFoundError("Warehouse not found with id " + warehouse_id);

    const product_index = foundWarehouse.products.findIndex(
      (el) => el.product.toHexString() === product.product
    );

    return { foundWarehouse, product_index };
  }

  static async removeProductInWareHouse(warehouse_id, code) {
    checkValidId(warehouse_id);
    let [warehouse, inventory] = await Promise.all([
      WareHouseRepository.findByQuery({
        _id: warehouse_id,
      }),
      InventoryRepository.findByQuery({
        code: code,
      }),
    ]);

    if (!warehouse)
      throw new NotFoundError(`Warehouse not found with id ${warehouse_id}`);

    if (!inventory)
      throw new NotFoundError(`Inventory not found with code ${code}`);

    const product_index = warehouse.products.findIndex(
      (product) => product.code == code
    );

    if (product_index == -1)
      throw new NotFoundError("Product Is Not In WareHouse");

    let number = warehouse.products[product_index].stock;

    warehouse.products.splice(product_index, 1);

    const [warehouseResult, invenResult] = await Promise.all([
      WareHouseRepository.save(warehouse),
      InventoryRepository.decreaseStockByCode(code, number),
    ]);

    return warehouseResult;
  }

  static async getProductInsideWarehouse(product_id) {
    const warehouse = await WareHouseRepository.findFirst();
    if (!warehouse) throw new NotFoundError("Cannot Found Any WareHouse!");

    const products = warehouse.products
      .filter((product) => product.product._id.toString() === product_id)
      .map(async (product) => {
        product.variation = await ProductService.findVariationValues(
          product.product._id.toString(),
          product.variation
        );
        return product;
      });

    return await Promise.all(products);
  }

  static async getProductAndWareHouseValue(product_id) {
    const [product, warehouse] = await Promise.all([
      ProductRepository.findProductById(product_id),
      WareHouseRepository.findByQuery({}),
    ]);

    if (!warehouse) {
      throw new NotFoundError(`Warehouse not found`);
    }
    return { product, warehouse };
  }

  static async addItemToWareHouse(productInput) {
    const { product, warehouse } = await this.getProductAndWareHouseValue(
      productInput._id.toString()
    );

    const variationCombinations = await this.combineVariations(product);

    const variations = await this.filterProductVariationsNotInWareHouse(
      variationCombinations,
      product._id.toString(),
      warehouse
    );
    if (variations.length > 0) {
      variations.forEach(async (item) => {
        let data = {
          product: product._id,
          variation: item.variation,
          code: item.code,
        };
        warehouse.products.push(data);
        const inventory = await InventoryRepository.findByQuery({
          code: item.code,
        });
        if (!inventory) await InventoryRepository.createInventory(data);
      });
      await WareHouseRepository.save(warehouse);
    }
  }

  static async filterProductVariationsNotInWareHouse(
    variations,
    product_id,
    warehouse
  ) {
    const results = await Promise.all(
      variations.map(async (variation) => {
        const code = await getCode(product_id, variation);
        const shouldInclude =
          warehouse.products.findIndex((el) => el.code === code) === -1;
        return shouldInclude ? { variation, code } : null;
      })
    );
    return results.filter((item) => item !== null);
  }

  static async combineVariations(product) {
    const variations = product.variation.map((variation) =>
      variation.properties.map((property) => ({
        variation_id: variation._id.toString(),
        property_id: property._id.toString(),
      }))
    );

    return generateVariations(variations);
  }
}
module.exports = WareHouseService;

// const code = await getCode(product._id.toString(), property);

//       const index = warehouse.products.findIndex((el) => el.code === code);

//       if (index !== -1) continue;

//       let item = {
//         product: product._id,
//         variation: property,
//         code: code,
//       };
//       warehouse.products.push(item);

//       const inventory = await InventoryRepository.findByQuery({
//         code: code,
//       });
//       if (!inventory) {
//         product.code = code;
//         await InventoryRepository.createInventory(product);
//       }
