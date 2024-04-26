const AccountRepository = require("../models/repositories/accountRepository");
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

  static async notiRequestDeliveryTrip(name) {
    const payload = {
      title: "Request Delivery Trip!",
      message: `New Delivery Trip Has Been Assigned To ${name}`,
      status: 1,
    };
    await this.createNotification(payload);
    _io.emit("requestDeliveryTrip", true);
  }

  static async notiToAdmin(account_id, type, name, action) {
    let account = await AccountRepository.findAccountById(account_id);
    const payload = {
      title: `${action} New ${type}!`,
      message: `${account.first_name} ${account.last_name} Has ${action} ${type}: ${name}`,
      status: 1,
    };
    await this.createNotification(payload);
    _io.emit("requestDeliveryTrip", true);
  }
}
module.exports = NotificationEfurnitureService;
