const _Cart = require("../cartModel");
const { getSelectData, getUnSelectData } = require("../../utils/index");
const {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const ProductRepository = require("./productRepository");
class CartRepository {
  static async createCart(account_id) {
    const cart = await _Cart.create({
      account_id: account_id,
      status: 1,
    });
    if (!cart) throw new InternalServerError();
    return cart;
  }

  static async findByAccountId(query) {
    return await _Cart
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();
  }

  static async addToCart(account_id, product) {
    const foundProduct = await ProductRepository.findProductById({
      _id: product._id,
    });
    if (!foundProduct)
      throw new NotFoundError(`Product ${product._id}` + ` not found`);
    const cart = await this.findByAccountId({ account_id: account_id });
    if (!cart) throw new InternalServerError();
    const foundIndex = cart.products.findIndex(
      (element) => element._id === product._id
    );
    if (foundIndex === -1) {
      cart.count_product++;
      cart.products.push(product);
    } else {
      cart.products[foundIndex].quantity++;
    }
    cart.total += product.quantity * foundProduct.price;
    await _Cart.updateOne(cart);
    return cart;
  }

  static async removeAll(account_id) {
    const cart = await this.findByAccountId({ account_id: account_id });
    cart.products = [];
    cart.count_product = 0;
    cart.total = 0;
    await _Cart.updateOne(cart);
    return cart;
  }

  static async removeItem(account_id, product) {
    const foundProduct = await ProductRepository.findProductById({
      _id: product._id,
    });
    if (!foundProduct)
      throw new NotFoundError(`Product ${product._id}` + `not found`);
    const cart = await this.findByAccountId({ account_id: account_id });
    const filtered = cart.products.filter((el) => el._id !== product._id);
    cart.products = filtered;
    if (cart.count_product > 0) cart.count_product--;
    if (cart.count_product === 0) cart.total = 0;
    else cart.total -= product.quantity * foundProduct.price;
    await _Cart.updateOne(cart);
    return cart;
  }

  static async updateItemQuantity(account_id, product, newQuantity) {
    const foundProduct = await ProductRepository.findProductById({
      _id: product._id,
    });
    if (!foundProduct)
      throw new NotFoundError(`Product ${product._id}` + ` not found`);
    const cart = await this.findByAccountId({ account_id: account_id });
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1)
      throw new NotFoundError("Product with id: " + product._id + " not found");
    // fix total with new quantity
    // minus old quantity
    cart.total -= cart.products[foundIndex].quantity * foundProduct.price;
    // set new quantity
    cart.products[foundIndex].quantity = newQuantity;
    // plus new quantity
    cart.total += newQuantity * foundProduct.price;
    await _Cart.updateOne(cart);
    return cart;
  }

  static async decreaseItemQuantity(account_id, product) {
    const foundProduct = await ProductRepository.findProductById({
      _id: product._id,
    });
    if (!foundProduct)
      throw new NotFoundError(`Product ${product._id}` + ` not found`);
    const cart = await this.findByAccountId({ account_id: account_id });
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1)
      throw new NotFoundError("Product with id: " + product._id + " not found");
    const updatedQuantity = cart.products[foundIndex].quantity--;
    if (updatedQuantity == 0) this.removeItem(account_id, product);
    // fix total with new quantity
    else cart.total -= foundProduct.price;
    return await _Cart.updateOne(cart);
  }

  static async increaseItemQuantity(account_id, product) {
    const foundProduct = await ProductRepository.findProductById({
      _id: product._id,
    });
    if (!foundProduct)
      throw new NotFoundError(`Product ${product._id}` + ` not found`);
    const cart = await this.findByAccountId({ account_id: account_id });
    const foundIndex = cart.products.findIndex((el) => el._id === product._id);
    if (foundIndex === -1)
      throw new NotFoundError("Product with id: " + product._id + " not found");
    cart.products[foundIndex].quantity++;
    cart.total += foundProduct.price;
    return await _Cart.updateOne(cart);
  }

  static async getCartWithPrice(query) {
    const cart = await _Cart
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean();

    const productPromises = cart.products.map(async (product) => {
      const foundProduct = await ProductRepository.findProductById({
        _id: product._id,
      });
      product.price = foundProduct.price;
    });

    await Promise.all(productPromises);
    return cart;
  }
}
module.exports = CartRepository;
