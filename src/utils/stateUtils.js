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

  static DeliveryTripStateMap = new Map([
    ["Reject", -1],
    ["Pending", 0],
    ["Processing", 1],
    ["Done", 2],
    ["default", 0],
  ]);
  static DeliveryTripState = (code) => {
    return (
      this.DeliveryTripStateMap.get(code) ||
      this.DeliveryTripStateMap.get("default")
    );
  };
}
module.exports = StateUtils;
