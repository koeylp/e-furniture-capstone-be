const { default: mongoose } = require("mongoose");
const { checkValidId, getUnSelectData } = require("../../utils");
const _Account = require("../accountModel");
const {
  BadRequestError,
  InternalServerError,
} = require("../../utils/errorHanlder");
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
  static async getAccounts(limit, page, sort, query = {}) {
    const skip = (page - 1) * limit;
    console.log(limit, page, sort);
    return await _Account
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
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
    checkValidId(account_id);
    return await _Account.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(account_id) },
      {
        $set: {
          full_name: full_name,
          avatar: avatar,
        },
      },
      { new: true }
    );
  }
  static async editAccountRole(account_id, role) {
    return await _Account.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(account_id) },
      {
        $set: {
          role: role,
        },
      },
      { new: true }
    );
  }
  static async editAccountUsername(account_id, username) {
    return await _Account.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(account_id) },
      {
        $set: {
          username: username,
        },
      },
      { new: true }
    );
  }
  static async editAccountPassword(account_id, password) {
    return await _Account.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(account_id) },
      {
        $set: {
          password: password,
        },
      },
      { new: true }
    );
  }
  static async enableAccount(account_id) {
    let query = {
      _id: new mongoose.Types.ObjectId(account_id),
    };
    const account = await this.findAccount(query);
    query = {
      username: account.username,
      status: 1,
    };
    const accountCheck = await this.findAccount(query);
    if (accountCheck) throw new BadRequestError("Username is already in use!");
    return await _Account.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(account_id) },
      {
        $set: {
          status: 1,
        },
      },
      { new: true }
    );
  }
  static async disableAccount(account_id) {
    return await _Account.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(account_id) },
      {
        $set: {
          status: 0,
        },
      },
      { new: true }
    );
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
