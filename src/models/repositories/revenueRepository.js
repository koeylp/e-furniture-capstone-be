const _Revenue = require("../revenueModel");
class RevenueRepository {
  static async updateOrInsert(profit, day) {
    let query = { date: day };
    let payload = {
      $inc: {
        profit: +profit,
      },
    };
    let options = { upsert: true, new: true };
    return await _Revenue.findOneAndUpdate(query, payload, options);
  }
  static async findRevenue(query) {
    const revenue = await _Revenue.findOne(query).lean();
    if (!revenue) return 0;
    return revenue.profit;
  }
  static async getRevenues(query) {
    return await _Revenue.find(query).lean();
  }
  static async updateRevenue(query, update) {
    return await _Revenue.findOneAndUpdate(query, update, { new: true });
  }
}
module.exports = RevenueRepository;
