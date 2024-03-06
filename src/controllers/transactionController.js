const TransactionService = require("../services/transactionService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateCreateTransaction } = require("../utils/validation");
class TransactionController {
  static async createTransaction(req, res) {
    const { error } = validateCreateTransaction(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Transaction Successfully!",
      metaData: await TransactionService.create(
        "65e86b5e666b62c29e70a354",
        req.body
      ),
    }).send(res);
  }
  static async getTransactions(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Transaction!",
      metaData: await TransactionService.getTransactions(page, limit),
    }).send(res);
  }
  static async getTransactionsByAccount(req, res) {
    const { account_id } = req.params;
    const { page, limit } = req.query;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Of Transaction!",
      metaData: await TransactionService.getTransactionsByAccount(
        account_id,
        page,
        limit
      ),
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
