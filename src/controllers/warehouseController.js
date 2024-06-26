const NotificationEfurnitureService = require("../services/NotificationEfurnitureService");
const InventoryService = require("../services/inventoryService");
const WareHouseService = require("../services/warehouseService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateCreateWareHouse } = require("../utils/validation");

class WareHouseController {
  static async createWareHouse(req, res) {
    const { error } = validateCreateWareHouse(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create WareHouse SuccessFully!",
      metaData: await WareHouseService.createWareHouse(req.body),
    }).send(res);
  }
  static async getWareHouses(req, res) {
    const { page, limit } = req.params;
    return new OK({
      message: "WareHouse Value!",
      metaData: await WareHouseService.getWareHouse(page, limit),
    }).send(res);
  }
  static async findWareHouseByProduct(req, res) {
    const { product_id } = req.params;
    if (!product_id) throw new BadRequestError();
    return new OK({
      message: "WareHouse Value!",
      metaData: await WareHouseService.findWareHouseByProduct(product_id),
    }).send(res);
  }
  static async findWareHouseById(req, res) {
    const { warehouse_id } = req.params;
    if (!warehouse_id) throw new BadRequestError();
    return new OK({
      message: "WareHouse Value!",
      metaData: await WareHouseService.findWareHouseById(warehouse_id),
    }).send(res);
  }
  static async findWareHouse(req, res) {
    return new OK({
      message: "WareHouse Value!",
      metaData: await WareHouseService.findWareHouse(),
    }).send(res);
  }
  static async updateWareHouse(req, res) {
    return new OK({
      message: "Update Ware House Successfully!",
      metaData: await WareHouseService.updateWareHouse(req.body),
    }).send(res);
  }
  static async removeWareHouse(req, res) {
    const { warehouse_id } = req.params;
    if (!warehouse_id) throw new BadRequestError();
    return new OK({
      message: "Remove WareHouse SuccessFully!",
      metaData: await WareHouseService.removewWareHouse(warehouse_id),
    }).send(res);
  }
  static async addProductToWareHouse(req, res) {
    const { warehouse_id } = req.params;
    if (!warehouse_id) throw new BadRequestError();
    return new OK({
      message: "Add product to Warehouse Successfully!",
      metaData: await WareHouseService.addProductToWareHouse(
        warehouse_id,
        req.body
      ),
    }).send(res);
  }
  static async updateProductStockInWarehouse(req, res) {
    let product = req.body;
    const { account_id } = req.payload;
    await InventoryService.updateInventoryStock(req.body);
    let result = await WareHouseService.updateProductStock(
      product,
      product.stock
    );
    await NotificationEfurnitureService.notiToAdmin(
      account_id,
      `Product Stock From ${result.oldStock} To ${result.newStock}`,
      result.name,
      "Updated"
    );
    return new OK({
      message: "Update Product Stock Warehouse Successfully!",
      metaData: result,
    }).send(res);
  }
  static async updateIsLowStock(req, res) {
    const { account_id } = req.payload;
    let result = await WareHouseService.UpdateIsLowStockNotification(req.body);
    await NotificationEfurnitureService.notiToAdmin(
      account_id,
      `Receive Notification Low Stock`,
      result.name,
      "Updated"
    );
    return new OK({
      message: "Update Notification Of LowStock Successfully!",
      metaData: result,
    }).send(res);
  }
  static async updateLowStockValue(req, res) {
    const { account_id } = req.payload;
    let result = await WareHouseService.updateLowStockValueInWarehouse(
      req.body
    );
    await NotificationEfurnitureService.notiToAdmin(
      account_id,
      `Product LowStock Threshold From ${result.oldThreshold} To ${result.newThreshold}`,
      result.name,
      "Updated"
    );
    return new OK({
      message: "Update Notification Of LowStock Successfully!",
      metaData: result,
    }).send(res);
  }
  static async removeProductFromWareHouse(req, res) {
    const { warehouse_id } = req.params;
    const { code } = req.body;
    if (!warehouse_id) throw new BadRequestError();
    return new OK({
      message: "Remove product From Warehouse Successfully!",
      metaData: await WareHouseService.removeProductInWareHouse(
        warehouse_id,
        code
      ),
    }).send(res);
  }

  static async getProductInsideWarehouse(req, res) {
    const { product_id } = req.params;
    if (!product_id) throw new BadRequestError();
    return new OK({
      message: "Warehouse Detail!",
      metaData: await WareHouseService.getProductInsideWarehouse(product_id),
    }).send(res);
  }

  static async addItemToWareHouse(req, res) {
    return new OK({
      message: "Warehouse Detail!",
      metaData: await WareHouseService.addItemToWareHouse(),
    }).send(res);
  }
}
module.exports = WareHouseController;
