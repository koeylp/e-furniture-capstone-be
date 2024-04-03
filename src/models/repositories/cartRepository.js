const _Cart = require("../cartModel");
const { getUnSelectData } = require("../../utils/index");
const { default: mongoose } = require("mongoose");
class CartRepository {
  static async createCart(account_id) {
    const cart = await _Cart.create({
      account_id: account_id,
      status: 1,
    });
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
  static async deleteProductInCart(product_id) {
    _Cart
      .find({
        "products._id": { $eq: product_id.toString() },
      })
      .then((carts) => {
        if (carts.length > 0) {
          carts.forEach((cart) => {
            const productIndex = cart.products.findIndex(
              (product) => product._id === product_id.toString()
            );
            if (productIndex !== -1) {
              const updatedProducts = cart.products
                .slice(0, productIndex)
                .concat(cart.products.slice(productIndex + 1));
              cart.products = updatedProducts;
            }
            cart.count_product -= 1;
          });
          Promise.all(carts.map((cart) => cart.save())).catch((error) =>
            console.error(error)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
module.exports = CartRepository;
