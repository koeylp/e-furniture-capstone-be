const { InternalServerError } = require("../../utils/errorHanlder");
const _Revenue = require("../revenueModel");
class RevenueRepository {
  static async create(payload) {
    const result = await _Revenue.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }

  static async findRevenue(query) {
    return await _Revenue.findOne(query).lean();
  }

  static async getRevenues(query) {
    return await _Revenue.find(query).lean();
  }

  static async updateRevenue(query, update) {
    return await _Revenue.findOneAndUpdate(query, update, { new: true });
  }
}
module.exports = RevenueRepository;
