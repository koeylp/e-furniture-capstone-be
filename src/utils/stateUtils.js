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
    return orderTrackingMap.get(code) || orderTrackingMap.get("default");
  };
  static ProcessingStateMap = new Map([
    ["Waiting", 1],
    ["Processing", 2],
    ["Booked", 3],
    ["default", "Pending"],
  ]);
  static ProcessingState = (code) => {
    return ProcessingStateMap.get(code) || ProcessingStateMap.get("default");
  };
}
module.exports = StateUtils;
