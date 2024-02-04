const VoucherSerivce = require("../services/voucherService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateVoucherInput } = require("../utils/validation");

const CLIENT_ID = "x-client-id";

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

  static async getAllActiveVouchers(req, res) {
    return new OK({
      message: "All active vouchers",
      metaData: await VoucherSerivce.getAllActiveVouchers(),
    }).send(res);
  }

  static async applyVoucher(req, res) {
    const account_id = req.headers[CLIENT_ID];
    const voucher_id = req.body;

    return new OK({
      message: "Apply voucher successfully",
      metaData: await VoucherSerivce.applyVoucher(account_id, voucher_id),
    }).send(res);
  }
}
module.exports = VoucherController;
