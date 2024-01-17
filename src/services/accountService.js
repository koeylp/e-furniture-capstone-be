const Repository = require("../models/Repository/repository");
const _Account = require("../models/accountModel");
const mongoose = require("mongoose");
const { checkValidId } = require("../utils");
const { BadRequestError } = require("../utils/errorHanlder");
const sortPhase = new Map([
  ["name_asc", { full_name: 1 }],
  ["name_desc", { full_name: -1 }],
  ["default", { _id: 1 }],
]);
const returnSortPhase = (code) => {
  return sortPhase.get(code) || sortPhase.get("default");
};
class AccountService {
  static async findAccount(account_id) {
    checkValidId(account_id);
    let query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      status: 1,
    };
    let filter = ["password", "__v"];
    return await Repository.findOneUnSelected({
      query,
      filter,
      MODEL: _Account,
    });
  }
  static async getAccounts(page = 1, limit = 12, sortCode = "default") {
    let sort = returnSortPhase(sortCode);
    return await Repository.findAll({ page, limit, sort, MODEL: _Account });
  }
  static async changeUsername(user_id, username) {
    checkValidId(user_id);
    let query = { username };
    const checkUsername = await Repository.checkOne({
      query,
      MODEL: _Account,
    });
    if (checkUsername) throw new BadRequestError("Username is already in use!");
    query = {
      user_id: new mongoose.Types.ObjectId(user_id),
      status: 1,
    };
    let update = { username };
    return await Repository.update({ query, update, MODEL: _Account });
  }
  static async checkOldPassword(user_id, oldPassword) {
    let query = {
      user_id: new mongoose.Types.ObjectId(user_id),
    };
    const user = await Repository.findOne({ query, MODEL: _Account });
  }
  static async changePassword(
    user_id,
    oldPassword,
    newPassword,
    confirmPassword
  ) {}
  static async enableDisableAccount(account_id) {
    checkValidId(account_id);
    let query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await Repository.enableDisAble({ query, MODEL: _Account });
  }
}
module.exports = AccountService;
