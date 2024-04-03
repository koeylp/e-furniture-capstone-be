const NotificationRepository = require("../models/repositories/notificationRepository");
class NotificationEfurnitureService {
  static async createNotification(payload) {
    return await NotificationRepository.create(payload);
  }
  static async getNotifications() {
    return await NotificationRepository.getNotifications();
  }
  static async getNotificationsByAccount(account_id) {
    return await NotificationRepository.getNotificationByAccountID(account_id);
  }
}
module.exports = NotificationEfurnitureService;
