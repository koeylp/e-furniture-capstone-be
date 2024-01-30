const _Cart = require("../cartModel");
const { getSelectData, getUnSelectData } = require("../../utils/index");
const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/errorHanlder");
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
      .find(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }
  static async addToCart(account_id, product) {
    const cart = await this.findByAccountId(account_id);
    if (!cart) throw new InternalServerError();
    cart.products.push(product);
    return await _Cart.update(cart);
  }
  static async getAlls(query) {
    return await _Product
      .find(query)
      .select(getUnSelectData(["__v", "isDraft", "isPublished"]))
      .lean();
  }
  static async getAllDraft() {
    const query = { isDraft: true, isPublished: false };
    return await this.getAlls(query);
  }
  static async getAllPublished() {
    const query = { isPublished: true, isDraft: false };
    return await this.getAlls(query);
  }
  static async removeMany(query) {}
}
module.exports = CartRepository;
