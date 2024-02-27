const { BadRequestError } = require("../utils/errorHanlder");
const WishlistRepositoy = require("../models/repositories/wishlistRepository");
const { verifyProductExistence } = require("../utils/verifyExistence");

class VoucherService {
  static async handleWishlist(account_id) {
    const QUERY = { account: account_id };
    let wishlist = await WishlistRepositoy.findByQuery(QUERY);
    if (!wishlist) {
      wishlist = await WishlistRepositoy.createWishlist(QUERY);
    }
    return wishlist;
  }

  static async addToWishlist(account_id, product_id) {
    await verifyProductExistence(product_id);
    let wishlist = await this.handleWishlist(account_id);
    if (
      wishlist.products.some((productId) => productId.toString() === product_id)
    ) {
      throw new BadRequestError(
        `Product with id ${product_id} already exists in wishlist`
      );
    }

    wishlist.products.push(product_id);
    await WishlistRepositoy.save(wishlist);
    return wishlist;
  }

  static async getByAccountId(account_id) {
    const QUERY = { account: account_id };
    return await WishlistRepositoy.findByQueryPopulate(QUERY);
  }

  static async removeProduct(account_id, product_id) {
    await verifyProductExistence(product_id);
    let wishlist = await this.handleWishlist(account_id);
    if (
      !wishlist.products.some(
        (productId) => productId.toString() === product_id
      )
    ) {
      throw new BadRequestError(
        `Product with id ${product_id} is not exists in wishlist`
      );
    }
    wishlist.products.pop(product_id);
    await WishlistRepositoy.save(wishlist);
    return wishlist;
  }

  static async addArrayToWishlist(account_id, products) {
    let wishlist = await this.handleWishlist(account_id);
    await Promise.all(
      products.map(async (el) => {
        await verifyProductExistence(el);
        if (
          wishlist.products.some((productId) => productId.toString() === el)
        ) {
          throw new BadRequestError(
            `Product with id ${el} already exists in wishlist`
          );
        }
        wishlist.products.push(el);
      })
    );
    await WishlistRepositoy.save(wishlist);
    return wishlist;
  }
}

module.exports = VoucherService;
