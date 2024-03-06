const orderTrackingMap = new Map([
  [0, "Pending"],
  [1, "Processing"],
  [2, "Shipping"],
  [3, "Done"],
  [4, "Cancel"],
  [5, "Failed"],
  [6, "Refunded"],
]);

module.exports = { orderTrackingMap };
