const NotificationEfurnitureRepository = require("../models/repositories/notificationEfurnitureRepository");
class NotificationEfurnitureService {
  static async createNotification(payload) {
    return await NotificationEfurnitureRepository.create(payload);
  }
  static async getNotifications() {
    return await NotificationEfurnitureRepository.getNotifications();
  }
  static async notiLowStock(name) {
    const payload = {
      title: "Low Stock!",
      message: `Low Stock With Product Name is ${name}`,
      status: 1,
    };
    const notification = await this.createNotification(payload);
    console.log(notification);
    _io.emit("lowstockWareHouse", true);
  }
  static async notiRequestDeliveryTrip() {
    const payload = {
      title: "Request Delivery Trip!",
      message: "New Delivery Trip Has Been Request",
      status: 2,
    };
    const notification = await this.createNotification(payload);
    console.log(notification);
    _io.emit("requestDeliveryTrip", true);
  }
  static async notiRequestDeliveryTrip() {
    const payload = {
      title: "Request Delivery Trip!",
      message: "New Delivery Trip Has Been Request",
      status: 1,
    };
    const notification = await this.createNotification(payload);
    console.log(notification);
    _io.emit("requestDeliveryTrip", true);
  }
}
module.exports = NotificationEfurnitureService;
