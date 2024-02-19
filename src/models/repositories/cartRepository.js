const _Cart = require("../cartModel");
const { getUnSelectData } = require("../../utils/index");
const { InternalServerError } = require("../../utils/errorHanlder");
class CartRepository {
  static async createCart(account_id) {
    const cart = await _Cart.create({
      account_id: account_id,
      status: 1,
    });
    if (!cart) throw new InternalServerError();
    return cart;
  }

  static async findByAccountId(query) {
    return await _Cart
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async save(cart) {
    await _Cart.findOneAndUpdate(cart._id, cart);
    return cart;
  }
}
module.exports = CartRepository;
