const BankInforService = require("../services/bankInforService");
const { OK } = require("../utils/successHandler");
const { BadRequestError } = require("../utils/errorHanlder");
const { validateCreateBankInfor } = require("../utils/validation");
class BankInforController {
  static async createBankInfor(req, res) {
    const { account_id } = req.payload;
    const { error } = validateCreateBankInfor(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Create BankInfor Successfully!",
      metaData: await BankInforService.createBankInfor(account_id, req.body),
    }).send(res);
  }
  static async findBankInforById(req, res) {
    const { account_id } = req.payload;
    const { bankInfor_id } = req.params;
    if (!bankInfor_id || !account_id) throw new BadRequestError();
    return new OK({
      message: "BankInfor Details!",
      metaData: await BankInforService.findBankInforById(
        account_id,
        bankInfor_id
      ),
    }).send(res);
  }
  static async findBankInforByAccount(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "BankInfor By Account!",
      metaData: await BankInforService.findBankInforByAccount(account_id),
    }).send(res);
  }
  static async setDefault(req, res) {
    const { account_id } = req.payload;
    const { bankInfor_id } = req.body;
    if (!bankInfor_id || !account_id) throw new BadRequestError();
    return new OK({
      message: "Set Default BankInfor Successfully!",
      metaData: await BankInforService.setDefault(account_id, bankInfor_id),
    }).send(res);
  }
  static async updateBankInfor(req, res) {
    const { account_id } = req.payload;
    const { bankInfor_id } = req.params;
    if (!account_id || !bankInfor_id) throw new BadRequestError();
    return new OK({
      message: "Update BankInfor Successfully!",
      metaData: await BankInforService.updateBankInfor(
        account_id,
        bankInfor_id,
        req.body
      ),
    }).send(res);
  }
  static async deleteBankInfor(req, res) {
    const { account_id } = req.payload;
    const { bankInfor_id } = req.body;
    if (!account_id || !bankInfor_id) throw new BadRequestError();
    return new OK({
      message: "Delete BankInfor Successfully!",
      metaData: await BankInforService.deleteBankInforById(
        bankInfor_id,
        account_id
      ),
    }).send(res);
  }
  static async deleteAllBankInfor(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Delete All BankInfor Successfully!",
      metaData: await BankInforService.deleteAllBankInfor(account_id),
    }).send(res);
  }
}
module.exports = BankInforController;
