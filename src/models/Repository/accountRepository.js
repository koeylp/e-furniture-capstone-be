const { default: mongoose } = require("mongoose");
const { checkValidId, getUnSelectData } = require("../../utils");
const _Account = require("../accountModel");
const { BadRequestError } = require("../../utils/errorHanlder");
const { hashCode } = require("../../utils/hashCode");
class AccountRepository {
  static async findAccountByUsername(username) {
    const query = {
      username: username,
      status: 1,
    };
    return await _Account
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
  }
  static async findAccountById(account_id) {
    checkValidId(account_id);
    const query = {
      _id: new mongoose.Types.ObjectId(account_id),
      status: 1,
    };
    const account = await _Account
      .findOne(query)
      .select(getUnSelectData(["__v", "password"]))
      .lean()
      .exec();
    if (!account) throw new BadRequestError("Cannot Find Any Account!");
    return account;
  }
  static async getAccounts(limit = 50, page = 1, sort) {
    const skip = (page - 1) * limit;
    return await _Account
      .find()
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(getUnSelectData(["__v", "password"]))
      .lean();
  }
  static async findAccount(query) {
    return await _Account
      .findOne(query)
      .select(getUnSelectData(["__v", "password"]))
      .lean();
  }
  static async editAccount(account_id, full_name, avatar) {
    const account = await this.findAccountById(account_id);
    account.full_name = full_name;
    account.avatar = avatar;
    return await _Account.updateOne(account);
  }
  static async editAccountRole(account_id, role) {
    const account = await this.findAccountById(account_id);
    account.role = role;
    return await _Account.updateOne(account);
  }
  static async editAccountUsername(account_id, username) {
    const account = await this.findAccountById(account_id);
    account.username = username;
    return await _Account.updateOne(account);
  }
  static async editAccountPassword(account_id, password) {
    const account = await this.findAccountById(account_id);
    account.password = await hashCode(password);
    return await _Account.updateOne(account);
  }
  static async enableAccount(account_id) {
    const account = await this.findAccountById(account_id);
    const query = {
      username: account.username,
      status: 1,
    };
    const accountCheck = await this.findAccount(query);
    if (accountCheck) throw new BadRequestError("Username is already in use!");
    account.status = 1;
    return await _Account.updateOne(account);
  }
  static async disableAccount(account_id) {
    const account = await this.findAccountById(account_id);
    account.status = 0;
    return await _Account.updateOne(account);
  }
  static async searchByText({ keySearch }) {
    const searchValue =
      typeof keySearch === "object" ? keySearch.text : keySearch;
    const regexSearch = new RegExp(searchValue);
    const result = await _Account
      .find(
        { $text: { $search: regexSearch } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .select(getUnSelectData(["__v", "password"]))
      .lean();
    return result;
  }
  static async createAccount(payload) {
    const account = await _Account.create({
      username: payload.username,
      password: payload.password,
      full_name: payload.full_name,
      avatar: payload.avatar,
      role: payload.role,
      status: payload.status,
    });
    if (!account) throw new InternalServerError();
    return account;
  }
}
module.exports = AccountRepository;
