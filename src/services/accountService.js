const AccountRepository = require("../models/repositories/accountRepository");
const mongoose = require("mongoose");
const { checkRoleNumber } = require("../utils");
const { BadRequestError, NotFoundError } = require("../utils/errorHanlder");
const { encryptCode, hashCode } = require("../utils/hashCode");
const RoleFactory = require("./roleFactory/role");
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
    let totalRole = 0;
    const roles = await RoleFactory.convertRoleFromRangeId(payload.role);
    if (!roles) throw new NotFoundError("Invalid Role!");
    roles.forEach((role) => {
      totalRole += role.value;
    });
    if (totalRole === 0) throw new BadRequestError("Role can not less than 0");
    payload.role = totalRole;
    const hashPassword = await hashCode(payload.password);
    payload.password = hashPassword;
    return await AccountRepository.createAccount(payload);
  }
  static async findAccount(account_id) {
    return await AccountRepository.findAccountById(account_id);
  }
  static async getUserAccounts(
    account_id,
    page = 1,
    limit = 12,
    sortCode = "default"
  ) {
    let sort = returnSortPhase(sortCode);
    const query = {
      _id: { $ne: new mongoose.Types.ObjectId(account_id) },
      role: { $lt: 32 },
      status: 1,
    };
    let accounts = await AccountRepository.getAccounts(
      limit,
      page,
      sort,
      query
    );
    await Promise.all(
      accounts.data.map(async (account) => {
        account.role = await RoleFactory.convertRole(account.role);
      })
    );
    return accounts;
  }
  static async getSystemAccounts(
    account_id,
    page = 1,
    limit = 12,
    sortCode = "default"
  ) {
    let sort = returnSortPhase(sortCode);
    const query = {
      _id: { $ne: new mongoose.Types.ObjectId(account_id) },
      role: { $gt: 32 },
      status: 1,
    };
    let accounts = await AccountRepository.getAccounts(
      limit,
      page,
      sort,
      query
    );
    await Promise.all(
      accounts.data.map(async (account) => {
        account.role = await RoleFactory.convertRole(account.role);
      })
    );
    return accounts;
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
  static async editRoleAccount(account_id, roles) {
    let totalRole = 0;
    roles = await RoleFactory.convertRoleFromRangeId(roles);
    if (!roles) throw new NotFoundError("Invalid Role!");
    roles.forEach((role) => {
      totalRole += role.value;
    });
    if (totalRole === 0) throw new BadRequestError("Role can not less than 0");
    return await AccountRepository.editAccountRole(account_id, totalRole);
  }
  static async searchByName(text) {
    return AccountRepository.searchByText({ keySearch: text });
  }
}
module.exports = AccountService;
