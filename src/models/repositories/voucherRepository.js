const _Voucher = require("../voucherModel");
const { getUnSelectData, checkValidId } = require("../../utils/index");

class VoucherRepository {
  static async create(voucher) {
    const newVoucher = await _Voucher.create(voucher);
    return newVoucher;
  }

  static async save(voucher) {
    return await _Voucher.findOneAndUpdate({ _id: voucher._id }, voucher);
  }

  static async findById(id) {
    checkValidId(id);
    return await _Voucher
      .findById(id)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async findAllByQuery(query, sortType) {
    return await _Voucher
      .find(query)
      .sort(sortType)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

}
module.exports = VoucherRepository;
