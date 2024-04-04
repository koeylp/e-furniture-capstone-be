const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const CartRepository = require("../models/repositories/cartRepository");
const { verifyProductExistence } = require("../utils/verifyExistence");
const { getBySpecified } = require("../utils/voucherUtil");
const { calculateOrderTotal } = require("../utils/calculator");
const CartUtils = require("../utils/cartUtils");
const { getCode } = require("../utils/codeUtils");
const ProductService = require("./productService");

class CartService {
  static async addToCart(account_id, product) {
    const code = await getCode(product._id, product.variation);
    let cart = await CartUtils.handleCart(account_id);
    const foundIndex = cart.products.findIndex((el) => el.code === code);
    if (foundIndex === -1) {
      cart.count_product++;
      product.code = code;
      cart.products.push(product);
    } else {
      cart.products[foundIndex].quantity++;
    }
    return await CartRepository.save(cart);
  }
  static async getProductIndex(account_id, code) {
    let cart = await CartUtils.handleCart(account_id);
    const foundIndex = cart.products.findIndex((el) => el.code === code);
    if (foundIndex === -1) throw new NotFoundError("Product not found in cart");
    return { cart, foundIndex };
  }
  static async checkProductIndex(account_id, code) {
    let cart = await CartUtils.handleCart(account_id);
    const foundIndex = cart.products.findIndex((el) => el.code === code);
    return { cart, foundIndex };
  }
  static async removeItem(account_id, product) {
    const { cart, foundIndex } = await this.getProductIndex(
      account_id,
      product.code
    );
    cart = await CartUtils.remove(cart, foundProduct, foundIndex);
    return await CartRepository.save(cart);
  }

  static async removeAll(account_id) {
    let cart = await CartUtils.handleCart(account_id);
    cart.products = [];
    cart.count_product = 0;
    return await CartRepository.save(cart);
  }

  static async updateItemQuantity(account_id, product, newQuantity) {
    const { cart, foundIndex } = await this.getProductIndex(
      account_id,
      product.code
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
      if (!foundProduct) throw new BadRequestError();
      cart.products[index]._id = foundProduct;
      cart.products[index].variation = await ProductService.findVariationValues(
        foundProduct._id.toString(),
        cart.products[index].variation
      );
    });
    await Promise.all(productPromises);
    return cart;
  }

  static async decreaseItemQuantity(account_id, product) {
    const { cart, foundIndex } = await this.getProductIndex(
      account_id,
      product.code
    );
    const updatedQuantity = --cart.products[foundIndex].quantity;
    if (updatedQuantity === 0) {
      cart = await CartUtils.remove(cart, foundIndex);
    }
    return await CartRepository.save(cart);
  }

  static async increaseItemQuantity(account_id, product) {
    const { cart, foundIndex } = await this.getProductIndex(
      account_id,
      product.code
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
      await this.addToCart(account_id, products[i]);
    }
    return await CartRepository.save(cart);
  }

  static async updateVariationCart(account_id, cartItem, oldItemcode) {
    const code = await getCode(cartItem._id, cartItem.variation);
    let { cart, foundIndex } = await this.checkProductIndex(account_id, code);
    if (foundIndex !== -1)
      throw new BadRequestError("Product is already in cart!");
    foundIndex = cart.products.findIndex((el) => el.code === oldItemcode);
    cart.products[foundIndex].variation = cartItem.variation;
    cart.products[foundIndex].code = code;
    return await CartRepository.save(cart);
  }
}

module.exports = CartService;
