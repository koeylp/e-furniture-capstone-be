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
    ["default", "Pending"],
  ]);
  static ProcessingState = (code) => {
    return (
      this.ProcessingStateMap.get(code) ||
      this.ProcessingStateMap.get("default")
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
}
module.exports = StateUtils;
