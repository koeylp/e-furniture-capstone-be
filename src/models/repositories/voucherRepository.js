const _Voucher = require("../voucherModel");
const {
  getUnSelectData,
  checkValidId,
  removeUndefineObject,
} = require("../../utils/index");
const { default: mongoose } = require("mongoose");

class VoucherRepository {
  static async create(voucher) {
    const newVoucher = await _Voucher.create(voucher);
    return newVoucher;
  }

  static async save(voucher) {
    return await _Voucher.findOneAndUpdate({ _id: voucher._id }, voucher);
  }

  static async update(query, payload) {
    const update = removeUndefineObject(payload);
    return await _Voucher.findOneAndUpdate(query, update);
  }

  static async updateVoucherById(voucher_id, payload) {
    checkValidId(voucher_id);
    const query = {
      _id: new mongoose.Types.ObjectId(voucher_id),
    };
    return await this.update(query, payload);
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

  static async removeVoucher(voucher_id) {
    checkValidId(voucher_id);
    const query = {
      _id: new mongoose.Types.ObjectId(voucher_id),
    };
    return await _Voucher.deleteOne(query);
  }
}
module.exports = VoucherRepository;
