const { default: mongoose } = require("mongoose");
const {
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const _Revenue = require("../revenueModel");
const { checkValidId } = require("../../utils");
class RevenueRepository {
  static async create(payload) {
    const result = await _Revenue.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }

  static async updateOrInsert(query, profit) {
    const result = await _Revenue
      .findOneAndUpdate(
        query,
        {
          $inc: {
            profit: +profit,
          },
        },
        { upsert: true, new: true }
      )
      .lean();
    if (!result) throw new NotFoundError();
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

  static async findRevenueById(revenue_id) {
    checkValidId(revenue_id);
    const query = {
      _id: new mongoose.Types.ObjectId(revenue_id),
    };
    return await this.findRevenue(query);
  }

  static async save(revenue) {
    return await _Revenue.updateOne({ _id: revenue._id }, revenue);
  }
}
module.exports = RevenueRepository;
