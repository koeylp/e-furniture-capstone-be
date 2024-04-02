const NotificationEfurnitureRepository = require("../models/repositories/notificationEfurnitureRepository");
class NotificationEfurnitureService {
  static async getNotifications() {
    return await NotificationEfurnitureRepository.getNotifications();
  }
}
module.exports = NotificationEfurnitureService;
