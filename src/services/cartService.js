const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const CartRepository = require("../models/repositories/cartRepository");

class CartService {
  static async handleCart(account_id) {
    const cart = await CartRepository.findByAccountId({
      account_id: account_id,
    });
    if (!cart) {
      throw new NotFoundError("Cart not found");
    }
    return cart;
  }

  static async addToCart(account_id, product) {
    const cart = await CartRepository.findByAccountId({
      account_id: account_id,
    });
    // check cart model whether existting if not create new one
    if (!cart) await CartRepository.createCart(account_id);
    // add to cart
    return await CartRepository.addToCart(account_id, product);
  }

  static async removeItem(account_id, product) {
    await CartService.handleCart(account_id);
    return await CartRepository.removeItem(account_id, product);
  }

  static async removeAll(account_id) {
    await CartService.handleCart(account_id);
    return await CartRepository.removeAll(account_id);
  }

  static async updateItemQuantity(account_id, product, newQuantity) {
    await CartService.handleCart(account_id);
    if (newQuantity < 0)
      throw new BadRequestError("quantity must be greater than or equal to 0");
    if (newQuantity === 0) this.removeItem(account_id, product);
    return await CartRepository.updateItemQuantity(
      account_id,
      product,
      newQuantity
    );
  }

  static async getCart(account_id) {
    return await CartRepository.getCartWithPrice({ account_id: account_id });
  }

  static async decreaseItemQuantity(account_id, product) {
    await CartService.handleCart(account_id);
    return await CartRepository.decreaseItemQuantity(account_id, product);
  }

  static async increaseItemQuantity(account_id, product) {
    await CartService.handleCart(account_id);
    return await CartRepository.increaseItemQuantity(account_id, product);
  }
}

module.exports = CartService;
