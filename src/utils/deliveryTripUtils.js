class DeliveryTripUtils {
  static getCurrentTrip(result) {
    return result.orders.findIndex((order) => order.status == 0);
  }
}
module.exports = DeliveryTripUtils;
