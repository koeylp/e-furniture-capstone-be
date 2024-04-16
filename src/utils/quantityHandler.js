class QuantityHandler {
  static increase(quantity, change) {
    return quantity + change;
  }
  static decrease(quantity, change) {
    return quantity - change ?? 0;
  }
  static replace(quantity, change) {
    return change;
  }
}
module.exports = QuantityHandler;
