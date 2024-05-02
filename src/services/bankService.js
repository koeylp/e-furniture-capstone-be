// CommonJS
const PayOS = require("@payos/node");
const { generateOrderCodePayOS } = require("../utils/generateOrderCode");

const payOS = new PayOS(
  "18249539-698d-41a3-8528-4bc1580f84aa",
  "f70abbe2-32d2-4625-a1a4-756b3960cda4",
  "dab08fb5e874314932707ac1e8d2e81db9f9e55d1aeb4ecfcb36a6e12677e36b"
);

class BankService {
  static async createPaymentLink(order) {
    const buyerAddress = `${order.order_shipping.address}, ${order.order_shipping.ward}, ${order.order_shipping.district}, ${order.order_shipping.province}`;
    const orderCode = await generateOrderCodePayOS(
      BankService.checkOrderCodeExists
    );
    let returnUrl = "https://efurniture.vercel.app/order-confirmation";
    let cancelUrl = "https://efurniture.vercel.app/order-cancelled";
    if (order.order_shipping.mobile) {
      returnUrl = order.order_shipping.mobile.returnUrl;
      cancelUrl = order.order_shipping.mobile.cancelUrl;
    }
    const body = {
      orderCode: orderCode,
      amount: order.order_checkout.paid.must_paid,
      description: order.order_code,
      buyerName: order.order_shipping.first_name,
      buyerEmail: order.order_shipping.email,
      buyerPhone: order.order_shipping.phone,
      buyerAddress: buyerAddress,
      expiredAt: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
      cancelUrl: cancelUrl,
      returnUrl: returnUrl,
    };
    const paymentLinkRes = await payOS.createPaymentLink(body);
    return paymentLinkRes;
  }

  static async getPaymentLinkInfomation(orderCode) {
    return await payOS.getPaymentLinkInformation(orderCode);
  }

  static async cancelPaymentLink() {
    return await payOS.cancelPaymentLink(1234);
  }

  static async confirmWebhook() {
    return await payOS.confirmWebhook("https://efurniture.vercel.app/");
  }

  static async verifyPaymentWebhookData(order) {
    return payOS.verifyPaymentWebhookData(order);
  }

  static async checkOrderCodeExists(orderCode) {
    try {
      const transaction = await BankService.getPaymentLinkInfomation(orderCode);
      if (transaction) return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = BankService;
