const AccountService = require("../services/accountService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateCreateAccount } = require("../utils/validation");
class AccountController {
  static async createAccount(req, res) {
    const { error } = validateCreateAccount(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Account Successfully!",
      metaData: await AccountService.createAccount(req.body),
    }).send(res);
  }
  static async findAccount(req, res) {
    const { account_id } = req.params;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Account Detail!",
      metaData: await AccountService.findAccount(account_id),
    }).send(res);
  }
  static async getAccounts(req, res) {
    const { page, limit, sortCode } = req.query;
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Account!",
      metaData: await AccountService.getAccounts(
        account_id,
        page,
        limit,
        sortCode
      ),
    }).send(res);
  }
  static async editPassword(req, res) {
    const { account_id } = req.payload;
    const { oldPassword, password, confirmPassword } = req.body;
    if (!oldPassword || !password || !confirmPassword || !account_id)
      throw new BadRequestError();
    return new OK({
      message: "Edit Password!",
      metaData: await AccountService.editPassword(
        account_id,
        oldPassword,
        password,
        confirmPassword
      ),
    }).send(res);
  }
  static async editAccount(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Edit Account!",
      metaData: await AccountService.editAccount(account_id, req.body),
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
