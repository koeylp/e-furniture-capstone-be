const AccountRepository = require("../models/repositories/accountRepository");
const mongoose = require("mongoose");
const { checkRoleNumber } = require("../utils");
const { BadRequestError } = require("../utils/errorHanlder");
const { encryptCode, hashCode } = require("../utils/hashCode");
const sortPhase = new Map([
  ["name_asc", { full_name: 1 }],
  ["name_desc", { full_name: -1 }],
  ["default", { _id: 1 }],
]);
const returnSortPhase = (code) => {
  return sortPhase.get(code) || sortPhase.get("default");
};
class AccountService {
  static async createAccount(payload) {
    const userCheck = await AccountRepository.findAccountByUsername(
      payload.username
    );
    if (userCheck) throw new BadRequestError("Username is already in use!");
    const hashPassword = await hashCode(payload.password);
    payload.password = hashPassword;
    return await AccountRepository.createAccount(payload);
  }
  static async findAccount(account_id) {
    return await AccountRepository.findAccountById(account_id);
  }
  static async getAccounts(
    account_id,
    page = 1,
    limit = 12,
    sortCode = "default"
  ) {
    let sort = returnSortPhase(sortCode);
    const query = {
      _id: { $ne: new mongoose.Types.ObjectId(account_id) },
    };
    return await AccountRepository.getAccounts(limit, page, sort, query);
  }
  static async checkOldPassword(account_id, oldPassword) {
    const user = await AccountRepository.findAccountById(account_id);
    const isValid = await encryptCode(oldPassword, user.password);
    if (!isValid) throw new BadRequestError("Wrong Recent Password!");
    return true;
  }
  static async editAccount(account_id, payload) {
    let query = {
      _id: { $ne: new mongoose.Types.ObjectId(account_id) },
      username: payload.username,
      status: 1,
    };
    const account = await AccountRepository.findAccount(query);
    if (account) throw new BadRequestError("Username is already in use!");
    return await AccountRepository.editAccount(account_id, payload);
  }
  static async editPassword(
    account_id,
    oldPassword,
    password,
    confirmPassword
  ) {
    const option = [];
    const user = await AccountRepository.findAccountById(account_id, option);
    const isValid = await encryptCode(oldPassword, user.password);
    if (!isValid) throw new BadRequestError("Wrong Old Password!");
    if (password !== confirmPassword) throw new BadRequestError();
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
