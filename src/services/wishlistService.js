const { NotFoundError } = require("../utils/errorHanlder");
const WishlistRepositoy = require("../models/repositories/wishlistRepository");
const { verifyProductExistence } = require("../utils/verifyExistence");
const { query } = require("express");

class VoucherService {
  static async handleWishlist(account_id) {
    const QUERY = { account_id: account_id };
    const wishlist = await WishlistRepositoy.findByQuery(QUERY);
    // create wishlist if not exist
    if (!wishlist) {
      wishlist = await WishlistRepositoy.createWishlist(QUERY);
    }
    return wishlist;
  }

  static async addToWishlist(account_id, product_id) {
    // verify existence of product
    await verifyProductExistence(product_id);

    const QUERY = { account_id: account_id };
    let wishlist = await WishlistRepositoy.findByQuery(QUERY);

    console.log(wishlist);

    // Check if the product is not already in the wishlist
    if (!wishlist.products.includes(product_id)) {
      wishlist.products.push(product_id);
      await WishlistRepositoy.save(wishlist);
    }

    return wishlist;
  }

  static async getByAccountId(account_id) {
    const QUERY = { account_id: account_id };
    return await WishlistRepositoy.findByQueryPopulate(QUERY);
  }

  static async removeProductInWishlist(account_id, product_id) {
    // verify existence of product
    await verifyProductExistence(product_id);
    const wishlist = await this.handleWishlist(account_id);
    const foundIndex = wishlist.products.findIndex(
      (el) => el._id === product_id
    );
    wishlist.products.splice(foundIndex, 1);
    return await WishlistRepositoy.save(wishlist);
  }
}

module.exports = VoucherService;
