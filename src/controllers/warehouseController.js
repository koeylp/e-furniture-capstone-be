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
  static async updateWareHouse(req, res) {
    const { warehouse_id } = req.params;
    if (!warehouse_id) throw new BadRequestError();
    return new OK({
      message: "Update Ware House Successfully!",
      metaData: await WareHouseService.updateWareHouse(warehouse_id, req.body),
    }).send(res);
  }
  static async removeWareHouse(req, res) {
    const { warehouse_id } = req.params;
    if (!warehouse_id) throw new BadRequestError();
    return new OK({
      message: "Removew WareHouse SuccessFully!",
      metaData: await WareHouseService.removewWareHouse(warehouse_id),
    }).send(res);
  }
  static async addProductToWareHouse(req, res) {
    const { warehouse_id } = req.params;
    if (!warehouse_id) throw new BadRequestError();
    return new OK({
      message: "Add product to Warehouse Successfully!",
      metaData: await WareHouseService.addProductToWareHouse(warehouse_id, req.body),
    }).send(res);
  }
}
module.exports = WareHouseController;
