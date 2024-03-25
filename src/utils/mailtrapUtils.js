const ProductRepository = require("../models/repositories/productRepository");
const { vndFormatCurrency } = require("../utils/format");

class MailtrapUtil {
  static async collectData(order) {
    const productsPromises = order.order_products.map(async (product) => {
      const foundProduct = await ProductRepository.findProductById(
        product.product_id
      );
      return {
        name: foundProduct.name,
        thumb: foundProduct.thumbs[0],
        quantity: product.quantity,
        price: vndFormatCurrency(product.price),
      };
    });
    const products = await Promise.all(productsPromises);
    const data = {
      order_shipping: order.order_shipping,
      products: products,
      total: vndFormatCurrency(order.order_checkout.final_total),
      order_code: order.order_code,
    };

    return data;
  }
}

module.exports = MailtrapUtil;
