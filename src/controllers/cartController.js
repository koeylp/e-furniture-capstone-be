const CartService = require("../services/cartService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");

const CLIENT_ID = "x-client-id";

class CartController {
  static async addToCart(req, res) {
    const { account_id } = req.payload;
    const product = req.body;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Added to cart",
      metaData: await CartService.addToCart(account_id, product),
    }).send(res);
  }

  static async removeItem(req, res) {
    const account_id = req.headers[CLIENT_ID];
    const product = req.body;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Removed",
      metaData: await CartService.removeItem(account_id, product),
    }).send(res);
  }

  static async removeAll(req, res) {
    const account_id = req.headers[CLIENT_ID];
    return new OK({
      message: "Removed all",
      metaData: await CartService.removeAll(account_id),
    }).send(res);
  }

  static async getCart(req, res) {
    const account_id = req.headers[CLIENT_ID];
    return new OK({
      message: "Your cart",
      metaData: await CartService.getCart(account_id),
    }).send(res);
  }

  static async updateItemQuantity(req, res) {
    const account_id = req.headers[CLIENT_ID];
    const { product, newQuantity } = req.body;
    return new OK({
      message: "Updated quantity",
      metaData: await CartService.updateItemQuantity(
        account_id,
        product,
        newQuantity
      ),
    }).send(res);
  }

  static async increaseItemQuantity(req, res) {
    const account_id = req.headers[CLIENT_ID];
    const product = req.body;
    return new OK({
      message: "Updated quantity",
      metaData: await CartService.increaseItemQuantity(account_id, product),
    }).send(res);
  }

  static async decreaseItemQuantity(req, res) {
    const account_id = req.headers[CLIENT_ID];
    const product = req.body;
    return new OK({
      message: "Updated quantity",
      metaData: await CartService.decreaseItemQuantity(account_id, product),
    }).send(res);
  }
}
module.exports = CartController;
