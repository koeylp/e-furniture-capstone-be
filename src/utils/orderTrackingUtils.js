const { orderTrackingMap } = require("../config/orderTrackingConfig");
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
    const forbiddenKeys = [3, 4, 5, 6];
    if (forbiddenKeys.includes(key_of_type)) {
      throw new BadRequestError(
        "The order is in a status that you cannot update the status of the order!"
      );
    }
  }
  static async validateDoneTrackUpdate(key_of_type) {
    const forbiddenKeys = [0, 1, 3, 4, 5, 6];
    if (forbiddenKeys.includes(key_of_type)) {
      throw new BadRequestError(
        "The order must be in shipping state, the current state: " +
          orderTrackingMap.get(key_of_type)
      );
    }
  }
  static async validateProcessingTrackUpdate(key_of_type) {
    const forbiddenKeys = [0, 3, 4, 5, 6];
    if (forbiddenKeys.includes(key_of_type)) {
      throw new BadRequestError(
        "The order must be in correct state, the current state: " +
          orderTrackingMap.get(key_of_type)
      );
    }
  }
  static async validatePendingTrackUpdate(key_of_type) {
    const forbiddenKeys = [1, 2, 3, 4, 5, 6];
    if (forbiddenKeys.includes(key_of_type)) {
      throw new BadRequestError(
        "The order must be in pending state, the current state: " +
          orderTrackingMap.get(key_of_type)
      );
    }
  }
}

module.exports = OrderTrackingUtil;
