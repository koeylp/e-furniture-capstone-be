const { BadRequestError } = require("./errorHanlder");

class OrderTrackingUtil {
  static async validatePresentTrackCancel(key_of_type) {
    const forbiddenKeys = [2, 3, 4, 5];
    if (forbiddenKeys.includes(key_of_type)) {
      throw new BadRequestError(
        "The order is in a status that you cannot cancel the order!"
      );
    }
  }

  static async validatePresentTrackUpdate(key_of_type) {
    const forbiddenKeys = [3, 4, 5];
    if (forbiddenKeys.includes(key_of_type)) {
      throw new BadRequestError(
        "The order is in a status that you cannot update the status of the order!"
      );
    }
  }
}

module.exports = OrderTrackingUtil;
