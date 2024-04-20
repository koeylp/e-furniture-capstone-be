const { default: mongoose } = require("mongoose");
const TransactionRepository = require("../models/repositories/transactionRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const StateUtils = require("../utils/stateUtils");

class TransactionService {
  static async create(payload) {
    return await TransactionRepository.create(payload);
  }

  static async createPaidTransaction(account_id, transaction, order_code) {
    const account = await AccountRepository.findAccountById(account_id);

    transaction.sender = {
      name: `${account.first_name} ${account.last_name}`,
      email: account.email,
    };
    transaction.receiver = {
      name: "eFurniture",
      email: "eFurniture@gmail.com",
    };
    transaction.description = `Paid For Order Code:${order_code}`;
    transaction.type = StateUtils.TransactionType("Income");

    return await this.create(transaction);
  }

  static async createRefundTransaction(report) {
    let transaction = {
      receiver: {
        name: report.requester.name,
        email: report.requester.email,
      },
      sender: {
        name: "eFurniture",
        email: "eFurniture@gmail.com",
      },
      amount: report.amount,
      description: report.note,
      type: StateUtils.TransactionType("Outcome"),
    };

    return await this.create(transaction);
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
