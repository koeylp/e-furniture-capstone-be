const orderTrackingMap = new Map([
    [1, "Pending"],
    [2, "Processing"],
    [3, "Shipping"],
    [4, "Done"],
    [5, "Cancel"],
  ]);

module.exports = { orderTrackingMap };
