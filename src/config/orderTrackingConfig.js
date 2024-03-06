const orderTrackingMap = new Map([
  [1, "Pending"],
  [2, "Processing"],
  [3, "Shipping"],
  [4, "Done"],
  [5, "Cancel_pending"],
  [6, "cancel_confirm"],
]);

module.exports = { orderTrackingMap };
