const NotiService = require("../services/NotificationEfurnitureService");
const { OK } = require("../utils/successHandler");
class NotificationEfurnitureController {
  static async getNotis(req, res) {
    return new OK({
      message: "List Of Notifications!",
      metaData: await NotiService.getNotifications(),
    }).send(res);
  }
}
module.exports = NotificationEfurnitureController;
