const _Wishlist = require("../wishlistModel");
const { checkValidId, getUnSelectData } = require("../../utils/index");

class WishlistRepositoy {
  static async findByQuery(query) {
    checkValidId(query.account_id);
    return await _Wishlist
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async findByQueryPopulate(query) {
    checkValidId(query.account_id);
    return await _Wishlist
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .populate("products")
      .lean();
  }

  static async createWishlist(wishlist) {
    const newWishlist = await _Wishlist.create(wishlist);
    return newWishlist;
  }

  static async save(wishlist) {
    return await _Wishlist.findOneAndUpdate({ _id: wishlist._id }, wishlist);
  }

}
module.exports = WishlistRepositoy;
