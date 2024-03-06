const { default: mongoose } = require("mongoose");
const {
  NotFoundError,
  InternalServerError,
} = require("../../utils/errorHanlder");
const _BankInfor = require("../bankInformationModel");
const { checkValidId, removeUndefineObject } = require("../../utils");
class BankInfor {
  static async createBankInfor(payload) {
    const result = await _BankInfor.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }
  static async findBankById(bank_id) {
    checkValidId(bank_id);
    const query = {
      _id: new mongoose.Types.ObjectId(bank_id),
    };
    const result = await _BankInfor.findOne(query).lean();
    if (!result) throw new NotFoundError();
    return result;
  }
  static async findBank(query) {
    const result = await _BankInfor.findOne(query).lean();
    if (!result) throw new NotFoundError();
    return result;
  }
  static async getBanks(query) {
    return await _BankInfor.find(query).lean();
  }
  static async updateBank(query, update) {
    update = removeUndefineObject(update);
    return await _BankInfor.findOneAndUpdate(query, update, { new: true });
  }
  static async deleteBank(query) {
    return await _BankInfor.deleteOne(query);
  }
  static async deleteBankRange(query) {
    return await _BankInfor.deleteMany(query);
  }
}
module.exports = BankInfor;
