const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const CartRepository = require("../models/repositories/cartRepository");
const { verifyProductExistence } = require("../utils/verifyExistence");
const { getBySpecified } = require("../utils/voucherUtil");
const { calculateOrderTotal } = require("../utils/calculator");
const CartUtils = require("../utils/cartUtils");

class CartService {
  static async addToCart(account_id, product) {
    let cart = await CartUtils.handleCart(account_id);
    await verifyProductExistence(product._id);
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1) {
      cart.count_product++;
      cart.products.push(product);
    } else {
      cart.products[foundIndex].quantity++;
    }
    return await CartRepository.save(cart);
  }

  static async removeItem(account_id, product) {
    let cart = await CartUtils.handleCart(account_id);
    const foundProduct = await verifyProductExistence(product._id);
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1)
      throw new NotFoundError(
        "Product with id: " + product._id + " not found in cart"
      );
    cart = await CartUtils.remove(cart, foundProduct, foundIndex);
    return await CartRepository.save(cart);
  }

  static async removeAll(account_id) {
    let cart = await CartUtils.handleCart(account_id);
    cart.products = [];
    cart.count_product = 0;
    cart.total = 0;
    return await CartRepository.save(cart);
  }

  static async updateItemQuantity(account_id, product, newQuantity) {
    let cart = await CartUtils.handleCart(account_id);
    await verifyProductExistence(product._id);
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1)
      throw new NotFoundError(
        "Product with id: " + product._id + " not found in cart"
      );
    if (newQuantity <= 0)
      throw new BadRequestError("new quantity must be greater than 0");
    cart.products[foundIndex].quantity = newQuantity;
    return await CartRepository.save(cart);
  }

  static async getCart(account_id) {
    let cart = await CartUtils.handleCart(account_id);
    const productPromises = cart.products.map(async (product, index) => {
      const foundProduct = await verifyProductExistence(product._id);
      if (foundProduct) {
        foundProduct.quantity_in_cart = cart.products[index].quantity;
        cart.products[index] = foundProduct;
      }
    });
    await Promise.all(productPromises);
    return cart;
  }

  static async decreaseItemQuantity(account_id, product) {
    let cart = await CartUtils.handleCart(account_id);
    const foundProduct = await verifyProductExistence(product._id);
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1)
      throw new NotFoundError(
        "Product with id: " + product._id + " not found in cart"
      );
    const updatedQuantity = --cart.products[foundIndex].quantity;
    if (updatedQuantity === 0) {
      cart.products[foundIndex].quantity++;
      cart = await CartUtils.remove(cart, foundProduct, foundIndex);
    }
    return await CartRepository.save(cart);
  }

  static async increaseItemQuantity(account_id, product) {
    let cart = await CartUtils.handleCart(account_id);
    await verifyProductExistence(product._id);
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1)
      throw new NotFoundError(
        "Product with id: " + product._id + " not found in cart"
      );
    cart.products[foundIndex].quantity++;
    return await CartRepository.save(cart);
  }

  static async checkout(products) {
    const productIds = products.products.map((product) => product._id);
    const vouchers = await getBySpecified(productIds);
    const total = calculateOrderTotal(products.products);
    return { products: products.products, total: total, vouchers: vouchers };
  }

  static async checkoutGuest(products) {
    const total = calculateOrderTotal(products.products);
    return { products: products.products, total: total };
  }

  static async addArrayToCart(account_id, products) {
    let cart = await CartUtils.handleCart(account_id);
    for (let i = 0; i < products.length; i++) {
      await verifyProductExistence(products[i]._id);
      const foundIndex = cart.products.findIndex(
        (el) => el._id === products[i]._id
      );
      if (foundIndex === -1) {
        cart.count_product++;
        cart.products.push(products[i]);
      } else {
        cart.products[foundIndex].quantity += products[i].quantity;
      }
    }
    return await CartRepository.save(cart);
  }
}

module.exports = CartService;
