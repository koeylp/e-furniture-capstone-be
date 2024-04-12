const { InternalServerError } = require("../../utils/errorHanlder");
const _NotificationEfuniture = require("../notificationEfurnitureModel");
class NotificationEfurnitureRepository {
  static async create(payload) {
    const result = await _NotificationEfuniture.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }
  static async getNotifications() {
    return await _NotificationEfuniture
      .find()
      .sort([["createdAt", -1]])
      .lean();
  }

  static async getNotificationsForAdmin() {
    return await _NotificationEfuniture
      .find({
        status: 1,
      })
      .sort([["createdAt", -1]])
      .lean();
  }

  static async getNotificationsForStaff() {
    return await _NotificationEfuniture
      .find({
        status: 2,
      })
      .sort([["createdAt", -1]])
      .lean();
  }
}
module.exports = NotificationEfurnitureRepository;
