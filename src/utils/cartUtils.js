const CartRepository = require("../models/repositories/cartRepository");
const { NotFoundError } = require("./errorHanlder");
const { verifyProductExistence } = require("./verifyExistence");

class CartUtils {
  static async remove(cart, foundIndex) {
    cart.products.splice(foundIndex, 1);
    cart.count_product--;
    return cart;
  }
  static async handleCart(account_id) {
    const QUERY = {
      account_id: account_id,
    };
    let cart = await CartRepository.findByAccountId(QUERY);
    if (!cart) {
      cart = await CartRepository.createCart(account_id);
    }
    return cart;
  }
  static async removeItem(account_id, product) {
    let cart = await CartUtils.handleCart(account_id);
    const foundProduct = await verifyProductExistence(product.product_id);
    const foundIndex = cart.products.findIndex(
      (el) => el.code === product.code
    );
    if (foundIndex === -1)
      throw new NotFoundError(
        "Product with id: " + product.product_id + " not found in cart"
      );
    cart = await this.remove(cart, foundProduct, foundIndex);
    return await CartRepository.save(cart);
  }
}

module.exports = CartUtils;
