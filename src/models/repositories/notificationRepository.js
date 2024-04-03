const { default: mongoose } = require("mongoose");
const { InternalServerError } = require("../../utils/errorHanlder");
const _Notification = require("../notificationModel");
const { checkValidId } = require("../../utils");
class NotificationRepository {
  static async create(payload) {
    const result = await _Notification.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }
  static async getNotifications(payload = {}) {
    return await _Notification.find(payload).lean();
  }
  static async getNotificationByAccountID(account_id) {
    checkValidId(account_id);
    const payload = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await this.getNotifications(payload);
  }
}
module.exports = NotificationRepository;
