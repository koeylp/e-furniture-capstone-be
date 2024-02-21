const WishlistService = require("../services/wishlistService");
const { OK } = require("../utils/successHandler");

class WishlistController {
  static async addToWishlist(req, res) {
    const product_id = req.params.product_id;
    const { account_id } = req.payload;
    return new OK({
      message: "Add to wishlist successfully!",
      metaData: await WishlistService.addToWishlist(account_id, product_id),
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
      message: "Add to wishlist successfully!",
      metaData: await WishlistService.removeProduct(account_id, product_id),
    }).send(res);
  }
}
module.exports = WishlistController;
