const InventoryService = require("../services/inventoryService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");

class InventoryController {
  static async create(req, res) {
    return new OK({
      message: "Create Inventory Successfully!",
      metaData: await InventoryService.create(req.body),
    }).send(res);
  }
}
module.exports = InventoryController;
