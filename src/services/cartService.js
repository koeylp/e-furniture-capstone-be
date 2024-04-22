const { NotFoundError, BadRequestError } = require("../utils/errorHanlder");
const CartRepository = require("../models/repositories/cartRepository");
const { verifyProductExistence } = require("../utils/verifyExistence");
const { getBySpecified } = require("../utils/voucherUtil");
const { calculateOrderTotal } = require("../utils/calculator");
const CartUtils = require("../utils/cartUtils");
const { getCode } = require("../utils/codeUtils");
const ProductService = require("./productService");
const InventoryRepository = require("../models/repositories/inventoryRepository");
const ProductRepository = require("../models/repositories/productRepository");

class CartService {
  static async addToCart(account_id, product) {
    let quantity = 0;
    await ProductRepository.checkProductById(product._id);
    const code = await getCode(product._id, product.variation);
    let cart = await CartUtils.handleCart(account_id);
    const foundIndex = cart.products.findIndex((el) => el.code === code);
    if (foundIndex === -1) {
      cart.count_product++;
      product.code = code;
      cart.products.push(product);
      quantity = product.quantity;
    } else {
      cart.products[foundIndex].quantity++;
      quantity = cart.products[foundIndex].quantity;
    }
    await this.checkOutOfStock(code, quantity);
    return await CartRepository.save(cart);
  }

  static async checkOutOfStock(code, quantity) {
    let inventory = await InventoryRepository.findByQuery({ code: code });
    if (quantity > inventory.stock)
      throw new BadRequestError(
        `This product is only available in quantities of ${inventory.stock}`
      );
  }

  static async updateMaxStock(code, quantity) {
    let outOfStock = false;
    let inventory = await InventoryRepository.findByQuery({ code: code });
    if (inventory.stock < 1) outOfStock = true;
    if (quantity > inventory.stock)
      return { stock: inventory.stock, outOfStock };
    return { stock: quantity, outOfStock };
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
    await this.checkOutOfStock(
      product.code,
      cart.products[foundIndex].quantity
    );
    return await CartRepository.save(cart);
  }

  static async getCart(account_id) {
    let cart = await CartUtils.handleCart(account_id);
    const productPromises = cart.products.map(async (product, index) => {
      // const foundProduct = await verifyProductExistence(product._id);
      const foundProduct = await ProductRepository.findProductByIDWithModify(
        product._id
      );
      if (!foundProduct) throw new BadRequestError();
      // let { stock, outOfStock } = await this.updateMaxStock(
      //   cart.products[index].code,
      //   cart.products[index].quantity
      // );
      cart.products[index]._id = foundProduct;
      cart.products[index]._id.select_variation =
        await ProductService.findVariationValues(
          foundProduct._id.toString(),
          cart.products[index].variation
        );
      cart.products[index]._id.quantity_in_cart = cart.products[index].quantity;
      cart.products[index]._id.code = cart.products[index].code;
      // if (outOfStock) {
      //   cart.products = cart.products.filter((product, i) => i !== index);
      //   cart.count_product--;
      //   await this.removeItem(account_id, product);
      // }
    });

    await Promise.all(productPromises);
    let productIds = [];
    for (const product of cart.products) {
      productIds.push(product._id);
    }

    // productIds = await Promise.all(
    //   productIds.map(async (data) => {
    //     let { total, variation } = await InventoryRepository.getStockForProduct(
    //       data._id,
    //       data.variation
    //     );
    //     data.variation = variation;
    //     data.stock = total;
    //     return { ...data };
    //   })
    // );

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
    await this.checkOutOfStock(
      product.code,
      cart.products[foundIndex].quantity
    );
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
    cart.products[foundIndex].quantity = 1;
    return await CartRepository.save(cart);
  }
}

module.exports = CartService;
