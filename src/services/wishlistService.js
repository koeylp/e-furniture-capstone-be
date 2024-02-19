const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const WishlistRepositoy = require("../models/repositories/wishlistRepository");
const { verifyProductExistence } = require("../utils/verifyExistence");
const { ObjectId } = require("mongoose").Types;

class VoucherService {
  static async handleWishlist(account_id) {
    const QUERY = { account: account_id };
    let wishlist = await WishlistRepositoy.findByQuery(QUERY);
    // create wishlist if not exist
    if (!wishlist) {
      wishlist = await WishlistRepositoy.createWishlist(QUERY);
    }
    return wishlist;
  }

  static async addToWishlist(account_id, product_id) {
    // verify existence of product
    await verifyProductExistence(product_id);

    let wishlist = await this.handleWishlist(account_id);

    // Convert the product_id string to ObjectId
    const productObjectId = new ObjectId(product_id);

    // Check if the product is already in the wishlist
    if (
      wishlist.products.some((productId) => productId.equals(productObjectId))
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
    // verify existence of product
    await verifyProductExistence(product_id);

    let wishlist = await this.handleWishlist(account_id);

    // Convert the product_id string to ObjectId
    const productObjectId = new ObjectId(product_id);

    // Check if the product is already in the wishlist
    if (
      !wishlist.products.some((productId) => productId.equals(productObjectId))
    ) {
      throw new BadRequestError(
        `Product with id ${product_id} is not exists in wishlist`
      );
    }

    wishlist.products.pop(product_id);
    await WishlistRepositoy.save(wishlist);

    return wishlist;
  }


}

module.exports = VoucherService;
