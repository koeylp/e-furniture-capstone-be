const { NotFoundError } = require("../utils/errorHanlder");
const WishlistRepositoy = require("../models/repositories/wishlistRepository");

const { getCode } = require("../utils/codeUtils");
const ProductService = require("./productService");
const { accessSync } = require("fs");

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
    const code = await getCode(product._id, product.variation);
    let wishlist = await this.handleWishlist(account_id);
    if (wishlist.products.some((el) => el.code === code)) return wishlist;
    product.code = code;
    wishlist.products.push(product);
    await WishlistRepositoy.save(wishlist);
    return wishlist;
  }

  static async getByAccountId(account_id) {
    await this.handleWishlist(account_id);
    const QUERY = { account: account_id };
    let wishlist = await WishlistRepositoy.findByQueryPopulate(QUERY);
    const productPromises = wishlist.products.map(async (item) => {
      item.variation = await ProductService.findVariationValues(
        item._id._id.toString(),
        item.variation
      );
    });
    await Promise.all(productPromises);
    return wishlist.products;
  }
  static async getProductIndex(account_id, code) {
    let wishlist = await this.handleWishlist(account_id);
    const foundIndex = wishlist.products.findIndex((el) => el.code === code);
    if (foundIndex === -1)
      throw new NotFoundError("Product not found in Wishlist");
    return { wishlist, foundIndex };
  }
  static async removeProduct(account_id, code) {
    const { wishlist, foundIndex } = await this.getProductIndex(
      account_id,
      code
    );
    wishlist.products.splice(foundIndex, 1);
    await WishlistRepositoy.save(wishlist);
    return wishlist;
  }

  static async addArrayToWishlist(account_id, products) {
    let wishlist = await this.handleWishlist(account_id);
    await Promise.all(
      products.map(async (el) => {
        await this.addToWishlist(account_id, el);
      })
    );
    await WishlistRepositoy.save(wishlist);
    return wishlist;
  }
}

module.exports = VoucherService;
