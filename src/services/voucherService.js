const { BadRequestError } = require("../utils/errorHanlder");
const VoucherRepository = require("../models/repositories/voucherRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const { calculateOrderTotal } = require("../utils/calculator");
const VoucherUtil = require("../utils/voucherUtil");
const ProductRepository = require("../models/repositories/productRepository");
const { default: mongoose } = require("mongoose");

class VoucherService {
  static async handleVoucher(voucher_id) {
    const found_voucher = await VoucherRepository.findById(voucher_id);
    if (!found_voucher)
      throw new BadRequestError(`Voucher ${voucher._id} not found`);
    return found_voucher;
  }

  static async createVoucher(voucher) {
    await VoucherUtil.validateCreatingVoucher(voucher);
    return await VoucherRepository.create(voucher);
  }

  static async getAllVouchers() {
    const QUERY = {};
    const SORT = [["createdAt", -1]];
    const vouchers = await VoucherRepository.findAllByQuery(QUERY, SORT);
    for (const voucher of vouchers) {
      const objectIds = voucher.products.map(
        (product) => new mongoose.Types.ObjectId(product)
      );
      const query = {
        _id: {
          $in: [objectIds],
        },
      };
      voucher.products = await ProductRepository.getAllsWithoutPopulateAndStock(
        query
      );
    }

    return vouchers;
  }

  static async applyVoucher(account_id, voucher_id, products) {
    const found_account = await AccountRepository.findAccountById(account_id);
    if (!found_account)
      throw new BadRequestError(`Account ${account_id} not found`);
    const found_voucher = await VoucherService.handleVoucher(voucher_id);
    await VoucherUtil.validateVoucher(found_voucher, account_id);
    const order_total = calculateOrderTotal(products);
    const result = await VoucherUtil.applyDiscount(
      found_voucher,
      products,
      order_total
    );
    await VoucherUtil.updateVoucherUsage(found_voucher, account_id);
    return result;
  }

  static async getBySpecified(products) {
    return await VoucherUtil.getBySpecified(products);
  }

  static async removeVoucher(voucher_id) {
    return await VoucherRepository.removeVoucher(voucher_id);
  }

  static async editVoucher(voucher_id, payload) {
    await this.handleVoucher(voucher_id);
    return await VoucherRepository.updateVoucherById(voucher_id, payload);
  }
}

module.exports = VoucherService;
