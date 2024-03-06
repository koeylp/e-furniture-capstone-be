const { default: mongoose } = require("mongoose");
const TransactionRepository = require("../models/repositories/transactionRepository");
const AccountRepository = require("../models/repositories/accountRepository");
class TransactionService {
  static async create(account_id, payload) {
    await AccountRepository.findAccountById(account_id);
    payload.account_id = account_id;
    return await TransactionRepository.create(payload);
  }
  static async getTransactionsByAccount(account_id, page = 1, limit = 12) {
    let query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await TransactionRepository.getTransaction({ query, page, limit });
  }
  static async getTransactions(page = 1, limit = 12) {
    return await TransactionRepository.getTransaction({ page, limit });
  }
  static async findTransaction(transaction_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(transaction_id),
    };
    return await TransactionRepository.findTransaction(query);
  }
}
module.exports = TransactionService;
