const VoucherSerivce = require("../services/voucherService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");

class VoucherController {
  static async createDiscountEvent(req, res) {
    const discountEvent = req.body;
    return new OK({
      message: "Created",
      metaData: await VoucherSerivce.createDiscountEvent(discountEvent),
    }).send(res);
  }
}
module.exports = VoucherController;
