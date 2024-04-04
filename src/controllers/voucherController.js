const VoucherSerivce = require("../services/voucherService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateVoucherInput } = require("../utils/validation");

class VoucherController {
  static async createVoucher(req, res) {
    const voucher = req.body;
    const { error } = validateVoucherInput(voucher);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Created",
      metaData: await VoucherSerivce.createVoucher(voucher),
    }).send(res);
  }

  static async getAllVouchers(req, res) {
    return new OK({
      message: "All active vouchers",
      metaData: await VoucherSerivce.getAllVouchers(),
    }).send(res);
  }

  static async applyVoucher(req, res) {
    const { account_id } = req.payload;
    const products = req.body;
    const voucher_id = req.params.voucher_id;
    return new OK({
      message: "Apply voucher successfully",
      metaData: await VoucherSerivce.applyVoucher(
        account_id,
        voucher_id,
        products
      ),
    }).send(res);
  }

  static async getBySpecified(req, res) {
    const products = req.body;
    return new OK({
      message: "Your voucher",
      metaData: await VoucherSerivce.getBySpecified(products),
    }).send(res);
  }

  static async removeVoucher(req, res) {
    const { voucher_id } = req.params;
    if (!voucher_id) throw new BadRequestError();
    return new OK({
      message: "Remove Voucher",
      metaData: await VoucherSerivce.removeVoucher(voucher_id),
    }).send(res);
  }
}
module.exports = VoucherController;
