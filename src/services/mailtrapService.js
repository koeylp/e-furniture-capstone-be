const { MailtrapClient } = require("mailtrap");
const ejs = require("ejs");
const fs = require("fs");
const ProductRepository = require("../models/repositories/productRepository");
const { vndFormatCurrency } = require("../utils/format");

const TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = "no-reply@efurniturenotification.live";
const filePath = "src/templates/emailTemplate.ejs";
const emailTemplate = fs.readFileSync(filePath, "utf-8");

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "eFurniture", email: SENDER_EMAIL };

const compiledTemplate = ejs.compile(emailTemplate);

class MailtrapService {
  static async send(order) {
    try {
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

      const renderedTemplate = compiledTemplate(data);

      await client.send({
        from: sender,
        to: [{ email: order.order_shipping.email }],
        subject: "Order Confirmation",
        html: renderedTemplate,
      });

      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

module.exports = MailtrapService;
