const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const CartRepository = require("../models/repositories/cartRepository");

class CartService {
  static async handleCart(account_id) {
    const QUERY = {
      account_id: account_id,
    };
    const cart = await CartRepository.findByAccountId(QUERY);
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
    return await CartRepository.addToCart(product, cart);
  }

  static async removeItem(account_id, product) {
    const cart = await CartService.handleCart(account_id);
    return await CartRepository.removeItem(product, cart);
  }

  static async removeAll(account_id) {
    const cart = await CartService.handleCart(account_id);
    return await CartRepository.removeAll(cart);
  }

  static async updateItemQuantity(account_id, product, newQuantity) {
    const cart = await CartService.handleCart(account_id);
    if (newQuantity < 0)
      throw new BadRequestError("quantity must be greater than or equal to 0");
    if (newQuantity === 0) this.removeItem(product, cart);
    return await CartRepository.updateItemQuantity(cart, product, newQuantity);
  }

  static async getCart(account_id) {
    const QUERY = { account_id: account_id };
    return await CartRepository.getCartWithPrice(QUERY);
  }

  static async decreaseItemQuantity(account_id, product) {
    const cart = await CartService.handleCart(account_id);
    return await CartRepository.decreaseItemQuantity(cart, product);
  }

  static async increaseItemQuantity(account_id, product) {
    const cart = await CartService.handleCart(account_id);
    return await CartRepository.increaseItemQuantity(cart, product);
  }
}

module.exports = CartService;
