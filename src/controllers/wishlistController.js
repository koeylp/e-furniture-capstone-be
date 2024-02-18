const WishlistService = require("../services/wishlistService");
const { OK } = require("../utils/successHandler");

const CLIENT_ID = "x-client-id";

class WishlistController {
  static async addToWishlist(req, res) {
    const product_id = req.params.product_id;
    const account_id = req.headers[CLIENT_ID];
    return new OK({
      message: "Add to wishlist successfully!",
      metaData: await WishlistService.addToWishlist(account_id, product_id),
    }).send(res);
  }

  static async removeProductInWishlist(req, res) {
    const product_id = req.params.product_id;
    const account_id = req.headers[CLIENT_ID];
    return new OK({
      message: "Add to wishlist successfully!",
      metaData: await WishlistService.removeProductInWishlist(account_id, product_id),
    }).send(res);
  }
}
module.exports = WishlistController;
