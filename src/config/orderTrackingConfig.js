const orderTrackingMap = new Map([
  [0, "Pending"],
  [1, "Processing"],
  [2, "Shipping"],
  [3, "Done"],
  [4, "Cancelled"],
  [5, "Refunded"],
  [6, "Failed"],
]);

module.exports = { orderTrackingMap };
