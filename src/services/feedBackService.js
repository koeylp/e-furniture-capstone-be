const AccountRepository = require("../models/repositories/accountRepository");
const ProductRepository = require("../models/repositories/productRepository");
const FeedBackRepository = require("../models/repositories/feedBackRepository");
const { default: mongoose } = require("mongoose");
class FeedBackService {
  static async create(account_id, payload) {
    await Promise.all([
      AccountRepository.findAccountById(account_id),
      ProductRepository.findProductById(payload.product_id),
    ]);
    payload.account_id = account_id;
    return await FeedBackRepository.createFeedBack(payload);
  }
  static async getFeedBacksByProduct(product_id, page = 1, limit = 12) {
    await ProductRepository.findProductById(product_id);
    const query = {
      product_id: new mongoose.Types.ObjectId(product_id),
    };
    return await FeedBackRepository.getFeedBacks(query, page, limit);
  }
  static async removeFeedBack(feedback_id) {}
}
module.exports = FeedBackService;
