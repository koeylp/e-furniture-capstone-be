const AccountService = require("../services/accountService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
class AccountController {
  static async findAccount(req, res) {
    const { account_id } = req.params;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Account Detail!",
      metaData: await AccountService.findAccount(account_id),
    }).send(res);
  }
  static async getAccounts(req, res) {
    const { page, limit, sortCode } = req.params;
    return new OK({
      message: "List Account!",
      metaData: await AccountService.getAccounts(page, limit, sortCode),
    }).send(res);
  }
  static async checkUsername(req, res) {
    const { account_id } = req.payload;
    const { username } = req.params;
    if (!username || !account_id) throw new BadRequestError();
    return new OK({
      message: "Find Username!",
      metaData: await AccountService.checkUsername(account_id, username),
    }).send(res);
  }
  static async checkOldPassword(req, res) {
    const { account_id } = req.payload;
    const { oldPassword } = req.params;
    if (!oldPassword || !account_id) throw new BadRequestError();
    return new OK({
      message: "Find Password!",
      metaData: await AccountService.checkOldPassword(account_id, oldPassword),
    }).send(res);
  }
  static async editUsername(req, res) {
    const { account_id } = req.payload;
    const { username } = req.body;
    if (!username || !account_id) throw new BadRequestError();
    return new OK({
      message: "Edit Username!",
      metaData: await AccountService.editUsername(account_id, username),
    }).send(res);
  }
  static async editPassword(req, res) {
    const { account_id } = req.payload;
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword || !account_id)
      throw new BadRequestError();
    return new OK({
      message: "Edit Password!",
      metaData: await AccountService.editAccount(
        account_id,
        password,
        confirmPassword
      ),
    }).send(res);
  }
  static async enableAccount(req, res) {
    const { account_id } = req.params;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Change Account Status Successfully!",
      metaData: await AccountService.enableAccount(account_id),
    }).send(res);
  }
  static async disableAccount(req, res) {
    const { account_id } = req.params;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Change Account Status Successfully!",
      metaData: await AccountService.disableAccount(account_id),
    }).send(res);
  }
  static async searchAccount(req, res) {
    const { text } = req.params;
    return new OK({
      message: "List Of Account!",
      metaData: await AccountService.searchByName(text),
    }).send(res);
  }
  static async editRole(req, res) {
    const { role } = req.body;
    const { account_id } = req.params;
    if (!account_id || !role) throw new BadRequestError();
    return new OK({
      message: "Update Role For Account Successfully!",
      metaData: await AccountService.editRoleAccount(account_id, role),
    }).send(res);
  }
}
module.exports = AccountController;
