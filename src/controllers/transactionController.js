const TransactionService = require("../services/transactionService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");

class TransactionController {
  static async getTransactions(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Transaction!",
      metaData: await TransactionService.getTransactions(page, limit),
    }).send(res);
  }
  static async findTransactionByID(req, res) {
    const { transaction_id } = req.params;
    if (!transaction_id) throw new BadRequestError();
    return new OK({
      message: "Transaction Details!",
      metaData: await TransactionService.findTransaction(transaction_id),
    }).send(res);
  }
}
module.exports = TransactionController;
