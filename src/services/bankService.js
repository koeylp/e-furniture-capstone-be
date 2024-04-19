// CommonJS
const PayOS = require("@payos/node");

const payOS = new PayOS(
  "18249539-698d-41a3-8528-4bc1580f84aa",
  "f70abbe2-32d2-4625-a1a4-756b3960cda4",
  "dab08fb5e874314932707ac1e8d2e81db9f9e55d1aeb4ecfcb36a6e12677e36b"
);

class BankService {
  static async createPaymentLink(order, size) {
    const buyerAddress = `${order.address}, ${order.ward}, ${order.district}, ${order.province}`;
    const body = {
      orderCode: size + 1,
      amount: order.order_checkout.final_total,
      description: order.order_code,
      buyerName: order.order_shipping.first_name,
      buyerEmail: order.order_shipping.email,
      buyerPhone: order.order_shipping.phone,
      buyerAddress: buyerAddress,
      cancelUrl: "https://efurniture.vercel.app/",
      returnUrl: "https://efurniture.vercel.app/",
    };
    const paymentLinkRes = await payOS.createPaymentLink(body);
    return paymentLinkRes.checkoutUrl;
  }

  static async getPaymentLinkInfomation() {
    return await payOS.getPaymentLinkInformation();
  }

  static async cancelPaymentLink() {
    return await payOS.cancelPaymentLink(1234);
  }

  static async confirmWebhook() {
    const temp = await payOS.confirmWebhook("https://efurniture.vercel.app/");
    console.log(temp);
  }

  static async verifyPaymentWebhookData() {
    return payOS.verifyPaymentWebhookData(req.body);
  }
}
module.exports = BankService;
