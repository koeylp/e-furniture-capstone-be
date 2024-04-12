const NotiService = require("../services/NotificationEfurnitureService");
const { OK } = require("../utils/successHandler");
class NotificationEfurnitureController {
  static async getNotis(req, res) {
    return new OK({
      message: "List Of Notifications!",
      metaData: await NotiService.getNotifications(),
    }).send(res);
  }

  static async getNotisAdmin(req, res) {
    return new OK({
      message: "List Of Notifications!",
      metaData: await NotiService.getNotificationsForAdmin(),
    }).send(res);
  }

  static async getNotisStaff(req, res) {
    return new OK({
      message: "List Of Notifications!",
      metaData: await NotiService.getNotificationsForStaff(),
    }).send(res);
  }
}
module.exports = NotificationEfurnitureController;
