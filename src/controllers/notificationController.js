const NotiService = require("../services/notificationService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
class NotificationEfurnitureController {
  static async getNotificationsByAccount(req, res) {
    const { account_id } = req.params;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Notifications By User!",
      metaData: await NotiService.getNotificationsByAccount(account_id),
    }).send(res);
  }
}
module.exports = NotificationEfurnitureController;
