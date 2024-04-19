const StateUtils = require("./stateUtils");

class OrderUtils {
  //   static modifyAmountForRefund(method, order_checkout, current_state) {
  //     if (method === StateUtils.PaymentMethod("online"))
  //       return this.refundTotal(order_checkout.total);
  //     if (current_state === StateUtils.OrderState("Processing"))
  //       return order_checkout.final_total;
  //     return order_checkout.paid.paid_amount;
  //   }

  static refundTotal(total) {
    return (total * 90) / 100;
  }
}
module.exports = OrderUtils;
