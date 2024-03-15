const FeedBackService = require("../services/feedBackService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateCreateFeedBack } = require("../utils/validation");
class FeedBackController {
  static async create(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    const { error } = validateCreateFeedBack(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create FeedBack Successfully!",
      metaData: await FeedBackService.create(account_id, req.body),
    }).send(res);
  }
  static async getFeedBacksByProduct(req, res) {
    const { product_id } = req.params;
    const { page, limit } = req.query;
    if (!product_id) throw new BadRequestError();
    return new OK({
      message: "Create FeedBack Successfully!",
      metaData: await FeedBackService.getFeedBacksByProduct(
        product_id,
        page,
        limit
      ),
    }).send(res);
  }
}
module.exports = FeedBackController;
