const { vndFormatCurrency } = require("../utils/format");

class MailtrapUtil {
  static async collectData(order) {
    const productsPromises = order.order_products.map(async (product) => {
      return {
        name: product.product_id.name,
        thumb: product.product_id.thumbs[0],
        quantity: product.quantity,
        price: vndFormatCurrency(product.product_id.sale_price),
      };
    });
    const products = await Promise.all(productsPromises);
    const data = {
      order_shipping: order.order_shipping,
      products: products,
      total: vndFormatCurrency(order.order_checkout.final_total),
      order_code: order.order_code,
      payment_method: order.payment_method,
    };

    return data;
  }
}

module.exports = MailtrapUtil;
