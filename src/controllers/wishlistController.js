const WishlistService = require("../services/wishlistService");
const { OK } = require("../utils/successHandler");

class WishlistController {
  static async addToWishlist(req, res) {
    const { account_id } = req.payload;
    const product = req.body;
    return new OK({
      message: "Add to wishlist successfully!",
      metaData: await WishlistService.addToWishlist(account_id, product),
    }).send(res);
  }

  static async getWishlistByAccount(req, res) {
    const { account_id } = req.payload;
    return new OK({
      message: "Your wishlist!",
      metaData: await WishlistService.getByAccountId(account_id),
    }).send(res);
  }

  static async removeProduct(req, res) {
    const product_id = req.params.product_id;
    const { account_id } = req.payload;
    return new OK({
      message: "Remove item from wishlist successfully!",
      metaData: await WishlistService.removeProduct(account_id, product_id),
    }).send(res);
  }

  static async addArrayToWishlist(req, res) {
    const products = req.body;
    const { account_id } = req.payload;
    return new OK({
      message: "Add to wishlist successfully!",
      metaData: await WishlistService.addArrayToWishlist(account_id, products),
    }).send(res);
  }
}
module.exports = WishlistController;
