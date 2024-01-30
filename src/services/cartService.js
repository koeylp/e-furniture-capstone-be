const _Cart = require("../models/cartModel");
const mongoose = require("mongoose");
const { NotFoundError } = require("../utils/errorHanlder");
const { handleProducts } = require("../utils");
class CartService {
  static async addToCart({ account_id, product }) {
    
    return 
  }
  static async removeItem({ account_id, productId }) {
    const cartCheck = await this.checkCartExist({ account_id });
    if (!cartCheck) throw new NotFoundError();
    const newProducts = cartCheck.products.filter(
      (product) => product._id !== productId
    );
    let query = {
      _id: new mongoose.Types.ObjectId(cartCheck._id),
    };
    let update = {
      products: newProducts,
      count_product: newProducts.length,
    };
    return await Repository.update({ query, update, MODEL: _Cart });
  }
  static async removeItems({ account_id, products }) {
    const cartCheck = await this.checkCartExist({ account_id });
    if (!cartCheck) throw new NotFoundError();
    const newProducts = cartCheck.products.filter(
      (product) => !products.includes(product._id)
    );
    let query = {
      _id: new mongoose.Types.ObjectId(cartCheck._id),
    };
    let update = {
      products: newProducts,
      count_product: newProducts.length,
    };
    return await Repository.update({ query, update, MODEL: _Cart });
  }
  static async removeAll({ account_id }) {
    const cartCheck = await this.checkCartExist({ account_id });
    if (!cartCheck) throw new NotFoundError();
    let query = {
      _id: new mongoose.Types.ObjectId(cartCheck._id),
    };
    let update = {
      products: [],
      count_product: 0,
    };
    return await Repository.update({ query, update, MODEL: _Cart });
  }
  static async updateItemQuantity({ account_id, productId, quantity }) {
    const cartCheck = await this.checkCartExist({ account_id });
    if (!cartCheck) throw new NotFoundError();
    let products = cartCheck.products;
    for (var product of products) {
      if (product._id === productId) product.quantity = quantity;
      break;
    }
    let query = {
      _id: new mongoose.Types.ObjectId(cartCheck._id),
    };
    let update = {
      products: products,
      count_product: products.length,
    };
    return await Repository.update({ query, update, MODEL: _Cart });
  }
  static async minusItemQuantity({ account_id, productId }) {
    const cartCheck = await this.checkCartExist({ account_id });
    if (!cartCheck) throw new NotFoundError();
    let products = cartCheck.products;
    for (var product of products) {
      if (product._id === productId) product.quantity -= 1;
      if (product.quantity === 0)
        products = products.filter((p) => p._id !== productId);
      break;
    }
    let query = {
      _id: new mongoose.Types.ObjectId(cartCheck._id),
    };
    let update = {
      products: products,
      count_product: products.length,
    };
    return await Repository.update({ query, update, MODEL: _Cart });
  }
  static async increaseItemQuantity({ account_id, productId }) {
    const cartCheck = await this.checkCartExist({ account_id });
    if (!cartCheck) throw new NotFoundError();
    let products = cartCheck.products;
    for (var product of products) {
      if (product._id === productId) product.quantity += 1;
      break;
    }
    let query = {
      _id: new mongoose.Types.ObjectId(cartCheck._id),
    };
    let update = {
      products: products,
      count_product: products.length,
    };
    return await Repository.update({ query, update, MODEL: _Cart });
  }
  static async getCart({ account_id }) {
    let query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await Repository.findOne({ query, MODEL: _Cart });
  }
}
module.exports = CartService;
