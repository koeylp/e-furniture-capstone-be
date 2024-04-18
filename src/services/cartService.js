const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const CartRepository = require("../models/repositories/cartRepository");
const { verifyProductExistence } = require("../utils/verifyExistence");
const { getBySpecified } = require("../utils/voucherUtil");
const { calculateOrderTotal } = require("../utils/calculator");
const CartUtils = require("../utils/cartUtils");
const { getCode } = require("../utils/codeUtils");
const ProductService = require("./productService");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const { defaultVariation } = require("../utils");
const ProductRepository = require("../models/repositories/productRepository");

class CartService {
  static async addToCart(account_id, product) {
    await ProductRepository.checkProductById(product._id);
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
    let { cart, foundIndex } = await this.getProductIndex(
      account_id,
      product.code
    );
    cart = await CartUtils.remove(cart, foundIndex);
    return await CartRepository.save(cart);
  }

  static async removeAll(account_id) {
    let cart = await CartUtils.handleCart(account_id);
    cart.products = [];
    cart.count_product = 0;
    return await CartRepository.save(cart);
  }

  static async updateItemQuantity(account_id, product, newQuantity) {
    let { cart, foundIndex } = await this.getProductIndex(
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
      cart.products[index]._id.select_variation =
        await ProductService.findVariationValues(
          foundProduct._id.toString(),
          cart.products[index].variation
        );
      cart.products[index]._id.quantity_in_cart = cart.products[index].quantity;
      cart.products[index]._id.code = cart.products[index].code;
    });
    await Promise.all(productPromises);
    let productIds = [];
    for (const product of cart.products) {
      productIds.push(product._id);
    }

    productIds = await Promise.all(
      productIds.map(async (data) => {
        let { total, variation } = await InventoryRepository.getStockForProduct(
          data._id,
          data.variation
        );
        data.variation = variation;
        data.stock = total;
        return { ...data };
      })
    );
    cart.products = productIds;
    return cart;
  }

  static async decreaseItemQuantity(account_id, product) {
    let { cart, foundIndex } = await this.getProductIndex(
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
    let { cart, foundIndex } = await this.getProductIndex(
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
    for (let i = 0; i < products.length; i++) {
      await this.addToCart(account_id, products[i]);
    }
    return true;
  }

  static async updateVariationCart(account_id, cartItem) {
    const code = await getCode(cartItem._id, cartItem.variation);
    let { cart, foundIndex } = await this.checkProductIndex(account_id, code);
    if (foundIndex !== -1)
      throw new BadRequestError("Product is already in cart!");
    foundIndex = cart.products.findIndex((el) => el.code === cartItem.code);
    cart.products[foundIndex].variation = cartItem.variation;
    cart.products[foundIndex].code = code;
    return await CartRepository.save(cart);
  }
}

module.exports = CartService;
