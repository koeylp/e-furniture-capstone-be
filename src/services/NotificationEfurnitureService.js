const NotificationEfurnitureRepository = require("../models/repositories/notificationEfurnitureRepository");
class NotificationEfurnitureService {
  static async createNotification(payload) {
    return await NotificationEfurnitureRepository.create(payload);
  }

  static async getNotifications() {
    return await NotificationEfurnitureRepository.getNotifications();
  }

  static async getNotificationsForAdmin() {
    return await NotificationEfurnitureRepository.getNotificationsForAdmin();
  }

  static async getNotificationsForStaff() {
    return await NotificationEfurnitureRepository.getNotificationsForStaff();
  }

  static async notiLowStock(name) {
    const payload = {
      title: "Low Stock!",
      message: `Low Stock With Product Name is ${name}`,
      status: 1,
    };
    await this.createNotification(payload);
    _io.emit("lowstockWareHouse", true);
  }
  static async notiRequestDeliveryTrip() {
    const payload = {
      title: "Request Delivery Trip!",
      message: "New Delivery Trip Has Been Request",
      status: 2,
    };
    await this.createNotification(payload);
    _io.emit("requestDeliveryTrip", true);
  }
}
module.exports = NotificationEfurnitureService;
