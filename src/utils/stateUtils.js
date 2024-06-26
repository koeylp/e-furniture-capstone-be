class StateUtils {
  static orderTrackingMap = new Map([
    ["Pending", "Pending"],
    ["Processing", "Processing"],
    ["Shipping", "Shipping"],
    ["Done", "Done"],
    ["Cancelled", "Cancelled"],
    ["Refunded", "Refunded"],
    ["Failed", "Failed"],
    ["default", "Pending"],
  ]);
  static OrderState = (code) => {
    return (
      this.orderTrackingMap.get(code) || this.orderTrackingMap.get("default")
    );
  };

  static ProcessingStateMap = new Map([
    ["Waiting", 1],
    ["Processing", 2],
    ["Booked", 3],
    ["default", 1],
  ]);
  static ProcessingState = (code) => {
    return (
      this.ProcessingStateMap.get(code) ||
      this.ProcessingStateMap.get("default")
    );
  };

  static ShippingStateMap = new Map([
    ["Waiting", 2],
    ["Processing", 3],
    ["Fail", 4],
    ["default", 2],
  ]);
  static ShippingState = (code) => {
    return (
      this.ShippingStateMap.get(code) || this.ShippingStateMap.get("default")
    );
  };

  static FlashSaleStateMap = new Map([
    ["Pending", 0],
    ["Ongoing", 1],
    ["End", 2],
    ["default", "Pending"],
  ]);
  static FlashSaleState = (code) => {
    return (
      this.FlashSaleStateMap.get(code) || this.FlashSaleStateMap.get("default")
    );
  };

  static AccountStateMap = new Map([
    ["Available", 1],
    ["Shipping", 2],
    ["default", 1],
  ]);
  static AccountState = (code) => {
    return (
      this.AccountStateMap.get(code) || this.AccountStateMap.get("default")
    );
  };

  static DeliveryTripStateMap = new Map([
    ["PickUpPackage", 0],
    ["Shipping", 1],
    ["ReturnWareHouse", 2],
    ["Done", 3],
    ["default", 0],
  ]);
  static DeliveryTripState = (code) => {
    return (
      this.DeliveryTripStateMap.get(code) ||
      this.DeliveryTripStateMap.get("default")
    );
  };

  static DeliveryTripStateValueMap = new Map([
    ["PickUpPackage", "Pick Up Package"],
    ["Shipping", "Shipping"],
    ["ReturnWareHouse", "Return To WareHouse"],
    ["Done", "Done"],
    ["default", "Return To WareHouse"],
  ]);
  static DeliveryTripStateValue = (code) => {
    return (
      this.DeliveryTripStateValueMap.get(code) ||
      this.DeliveryTripStateValueMap.get("default")
    );
  };

  static paymentMedthodPhase = new Map([
    ["online", "Online Payment"],
    ["cod", "COD"],
    ["default", "Online Payment"],
  ]);
  static PaymentMethod = (code) => {
    return (
      this.paymentMedthodPhase.get(code) ||
      this.paymentMedthodPhase.get("default")
    );
  };

  static TransactionTypePhase = new Map([
    ["Income", "Income"],
    ["Outcome", "Outcome"],
    ["default", "Income"],
  ]);
  static TransactionType = (code) => {
    return (
      this.TransactionTypePhase.get(code) ||
      this.TransactionTypePhase.get("default")
    );
  };

  static ProductItemOrderPhase = new Map([
    ["FeedBack", 1],
    ["PayAgain", 2],
    ["default", 2],
  ]);
  static ProductItemOrderType = (code) => {
    return (
      this.ProductItemOrderPhase.get(code) ||
      this.ProductItemOrderPhase.get("default")
    );
  };
}
module.exports = StateUtils;
