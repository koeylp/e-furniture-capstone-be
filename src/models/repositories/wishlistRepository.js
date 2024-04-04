const _Wishlist = require("../wishlistModel");
const { checkValidId, getUnSelectData } = require("../../utils/index");

class WishlistRepositoy {
  static async findByQuery(query) {
    checkValidId(query.account);
    return await _Wishlist
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async findByQueryPopulate(query) {
    checkValidId(query.account);
    return await _Wishlist
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .populate("products")
      .lean();
  }

  static async createWishlist(query) {
    const newWishlist = await _Wishlist.create(query);
    return newWishlist;
  }

  static async save(wishlist) {
    return await _Wishlist.findOneAndUpdate({ _id: wishlist._id }, wishlist);
  }
  static async deleteProductInWishList(product_id) {
    _Wishlist
      .find({
        "products._id": { $eq: product_id },
      })
      .then((wishlists) => {
        if (wishlists.length > 0) {
          wishlists.forEach((wishlist) => {
            const productIndex = wishlist.products.findIndex(
              (product) => product._id === product_id.toString()
            );
            if (productIndex !== -1) {
              const updatedProducts = wishlist.products
                .slice(0, productIndex)
                .concat(wishlist.products.slice(productIndex + 1));
              wishlist.products = updatedProducts;
            }
          });
          Promise.all(wishlists.map((wishlist) => wishlist.save())).catch(
            (error) => console.error(error)
          );
        }
      });
  }
}
module.exports = WishlistRepositoy;
