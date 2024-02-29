const FlashSaleService = require("../services/flashSaleService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const {
  validateCreateFlashSale,
  validateUpdateFlashSale,
} = require("../utils/validation");
class FlashSaleController {
  static async create(req, res) {
    const { error } = validateCreateFlashSale(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create FlashSale Successfully!",
      metaData: await FlashSaleService.create(req.body),
    }).send(res);
  }
  static async getFlashSales(req, res) {
    return new OK({
      message: "List Of FlashSale!",
      metaData: await FlashSaleService.getFlashSales(),
    }).send(res);
  }
  static async findFlashSale(req, res) {
    const { flashSale_id } = req.params;
    if (!flashSale_id) throw new BadRequestError();
    return new OK({
      message: "FlashSale Detail!",
      metaData: await FlashSaleService.findFlashSaleById(flashSale_id),
    }).send(res);
  }
  static async updateFlashSale(req, res) {
    const { flashSale_id } = req.params;
    if (!flashSale_id) throw new BadRequestError();
    const { error } = validateUpdateFlashSale(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Update FlashSale Successfully!",
      metaData: await FlashSaleService.update(flashSale_id, req.body),
    }).send(res);
  }
  static async publishFlashSale(req, res) {
    const { flashSale_id } = req.params;
    if (!flashSale_id) throw new BadRequestError();
    return new OK({
      message: "Publish FlashSale Successfully!",
      metaData: await FlashSaleService.publish(flashSale_id),
    }).send(res);
  }
  static async draftFlashSale(req, res) {
    const { flashSale_id } = req.params;
    if (!flashSale_id) throw new BadRequestError();
    return new OK({
      message: "Draft FlashSale Successfully!",
      metaData: await FlashSaleService.draft(flashSale_id),
    }).send(res);
  }
  static async removeFlashSale(req, res) {
    const { flashSale_id } = req.params;
    if (!flashSale_id) throw new BadRequestError();
    return new OK({
      message: "Remove FlashSale Successfully!",
      metaData: await FlashSaleService.remove(flashSale_id),
    }).send(res);
  }
}
module.exports = FlashSaleController;
