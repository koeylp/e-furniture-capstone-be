const Repository = require("../models/Repository/repository");
const AccountRepository = require("../models/Repository/accountRepository");
const mongoose = require("mongoose");
const { checkValidId, checkRoleNumber } = require("../utils");
const { BadRequestError } = require("../utils/errorHanlder");
const { encryptCode } = require("../utils/hashCode");
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
    return await AccountRepository.findAccountById(account_id);
  }
  static async getAccounts(page = 1, limit = 12, sortCode = "default") {
    let sort = returnSortPhase(sortCode);
    return await AccountRepository.getAccounts(page, limit, sort);
  }
  static async checkUsername(account_id, username) {
    let query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      username,
      status: 1,
    };
    return await AccountRepository.findAccount(query);
  }
  static async checkOldPassword(account_id, oldPassword) {
    const user = await AccountRepository.findAccountById(account_id);
    const isValid = await encryptCode(oldPassword, user.password);
    if (!isValid) throw new BadRequestError("Wrong Recent Password!");
    return true;
  }
  static async editAccount(account_id, payload) {
    return await AccountRepository.editAccount(
      account_id,
      payload.full_name,
      payload.avatar
    );
  }
  static async editUsername(account_id, username) {
    return await AccountRepository.editAccountUsername(account_id, username);
  }
  static async editPassword(account_id, password, confirmPassword) {
    if (password !== confirmPassword) throw new BadRequestError();
    const user = await AccountRepository.findAccountById(account_id);
    const isValid = await encryptCode(password, user.password);
    if (isValid) throw new BadRequestError("Cannot Use Recent Password");
    return await AccountRepository.editAccountPassword(account_id, password);
  }
  static async enableAccount(account_id) {
    return await AccountRepository.enableAccount(account_id);
  }
  static async disableAccount(account_id) {
    return await AccountRepository.disableAccount(account_id);
  }
  static async editRoleAccount(account_id, role) {
    checkRoleNumber(role);
    return await AccountRepository.editAccountRole(account_id, role);
  }
  static async searchByName(text) {
    return AccountRepository.searchByText({ keySearch: text });
  }
}
module.exports = AccountService;
