const { NotFoundError } = require("../utils/errorHanlder");
const WishlistRepositoy = require("../models/repositories/wishlistRepository");

class VoucherService {
  static async handleWishlist(account_id) {
    const QUERY = { account: account_id };
    let wishlist = await WishlistRepositoy.findByQuery(QUERY);
    if (!wishlist) {
      wishlist = await WishlistRepositoy.createWishlist(QUERY);
    }
    return wishlist;
  }

  static async addToWishlist(account_id, product) {
    let wishlist = await this.handleWishlist(account_id);
    if (wishlist.products.some((el) => el === product)) return wishlist;
    wishlist.products.push(product);
    await WishlistRepositoy.save(wishlist);
    console.log(wishlist);
    return wishlist;
  }

  static async getByAccountId(account_id) {
    await this.handleWishlist(account_id);
    const QUERY = { account: account_id };
    let wishlist = await WishlistRepositoy.findByQueryPopulate(QUERY);
    return wishlist.products;
  }
  static async getProductIndex(account_id, product) {
    let wishlist = await this.handleWishlist(account_id);
    const foundIndex = wishlist.products.findIndex((el) => el === product);
    if (foundIndex === -1)
      throw new NotFoundError("Product not found in Wishlist");
    return { wishlist, foundIndex };
  }
  static async removeProduct(account_id, product) {
    const { wishlist, foundIndex } = await this.getProductIndex(
      account_id,
      product
    );
    wishlist.products.splice(foundIndex, 1);
    await WishlistRepositoy.save(wishlist);
    return wishlist;
  }

  static async addArrayToWishlist(account_id, products) {
    for (let index = 0; index < products.length; index++) {
      await this.addToWishlist(account_id, products[index]);
    }
    return true;
  }
}

module.exports = VoucherService;
