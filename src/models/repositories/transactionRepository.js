const _Transaction = require("../transactionModel");
const { InternalServerError } = require("../../utils/errorHanlder");
class TransactionRepository {
  static async create(payload) {
    const result = await _Transaction.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }
  static async getTransaction({ query, page, limit }) {
    const skip = (page - 1) * limit;
    const total = await _Transaction.find(query);
    const result = await _Transaction
      .find(query)
      .skip(skip)
      .limit(limit)
      .lean();
    return { total: total.length, data: result };
  }
  static async findTransaction(query) {
    return await _Transaction.findOne(query).lean();
  }
}
module.exports = TransactionRepository;
