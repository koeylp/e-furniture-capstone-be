const _FeedBack = require("../feedBackModel");
const { InternalServerError } = require("../../utils/errorHanlder");
class FeedBackRepository {
  static async createFeedBack(payload) {
    const result = await _FeedBack.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }
  static async getFeedBacks(query = {}, page, limit) {
    const skip = (page - 1) * limit;
    return await _FeedBack
      .find(query)
      .populate({
        path: "account_id",
        select: "first_name last_name",
      })
      .skip(skip)
      .limit(limit)
      .lean();
  }
}
module.exports = FeedBackRepository;
