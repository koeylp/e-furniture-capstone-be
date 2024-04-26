const FeedBackService = require("../services/feedBackService");
const OrderService = require("../services/orderSerivce");
const { BadRequestError } = require("../utils/errorHanlder");
const StateUtils = require("../utils/stateUtils");
const { OK } = require("../utils/successHandler");
const { validateCreateFeedBack } = require("../utils/validation");
class FeedBackController {
  static async create(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    const payload = req.body;
    const { error } = validateCreateFeedBack(payload);
    if (error) throw new BadRequestError(error.details[0].message);
    let feedback = await FeedBackService.create(account_id, payload);
    let state = StateUtils.ProductItemOrderType("PayAgain");
    await OrderService.updateProductItemState(
      payload.order_code,
      payload.product_id,
      state
    );
    return new OK({
      message: "Create FeedBack Successfully!",
      metaData: feedback,
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
