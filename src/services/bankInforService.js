const { default: mongoose } = require("mongoose");
const BankInforRepository = require("../models/repositories/bankInforRepository");
const AccountRepository = require("../models/repositories/accountRepository");
class BankInforService {
  static async createBankInfor(account_id, payload) {
    await AccountRepository.findAccountById(account_id);
    payload.account_id = account_id;
    return await BankInforRepository.createBankInfor(payload);
  }
  static async findBankInforById(account_id, bankInfor_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(bankInfor_id),
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await BankInforRepository.findBank(query);
  }
  static async findBankInforByAccount(account_id) {
    const query = {
      account_id,
    };
    return await BankInforRepository.getBanks(query);
  }
  static async findBankInforDefaultByAccount(account_id) {
    const query = {
      account_id,
      is_default: true,
    };
    return await BankInforRepository.findBank(query);
  }
  static async setDefault(account_id, bankInfor_id) {
    let query = { account_id, is_default: true };
    let update = {
      $set: { is_default: false },
    };
    await BankInforRepository.updateBank(query, update);
    query = { _id: new mongoose.Types.ObjectId(bankInfor_id) };
    update = {
      $set: { is_default: true },
    };
    return await BankInforRepository.updateBank(query, update);
  }
  static async updateBankInfor(account_id, bankInfor_id, payload) {
    const query = {
      _id: new mongoose.Types.ObjectId(bankInfor_id),
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await BankInforRepository.updateBank(query, payload);
  }
  static async deleteBankInforById(bankInfor_id, account_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(bankInfor_id),
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await BankInforRepository.deleteBank(query);
  }
  static async deleteAllBankInfor(account_id) {
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await BankInforRepository.deleteBankRange(query);
  }
}
module.exports = BankInforService;
