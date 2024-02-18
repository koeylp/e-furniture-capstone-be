const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateCreateAddress } = require("../utils/validation");
const AddressService = require("../services/addressService");
class AddressController {
  static async createAddress(req, res) {
    const { account_id } = req.payload;
    const { error } = validateCreateAddress(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    return new OK({
      message: "Create Address Successfully!",
      metaData: await AddressService.createAddress(account_id, req.body),
      accessToken: req.accessToken,
      refreshToken: req.refreshToken,
    }).send(res);
  }
  static async getAddressByUser(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Address By User!",
      metaData: await AddressService.getAddressByUser(account_id),
    }).send(res);
  }
  static async getAddressDefault(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Default Address By User!",
      metaData: await AddressService.getAddressDefault(account_id),
    }).send(res);
  }
  static async setAddressDefault(req, res) {
    const { address_id } = req.params;
    const { account_id } = req.payload;
    if (!account_id || !address_id) throw new BadRequestError();
    return new OK({
      message: "Set Default Address Successfully!",
      metaData: await AddressService.setAddressDefault(account_id, address_id),
    }).send(res);
  }
  static async editAddress(req, res) {
    const { address_id } = req.params;
    if (!address_id) throw new BadRequestError();
    return new OK({
      message: "Edit Address Successfully!",
      metaData: await AddressService.editAddress(address_id, req.body),
    }).send(res);
  }
  static async removeAddress(req, res) {
    const { address_id } = req.params;
    if (!address_id) throw new BadRequestError();
    return new OK({
      message: "Remove Address Successfully!",
      metaData: await AddressService.removeAddress(address_id),
    }).send(res);
  }
  static async removeAllAccountAddress(req, res) {
    const { account_id } = req.payload;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "Remove All Address Successfully!",
      metaData: await AddressService.removeAllAccountAddress(account_id),
    }).send(res);
  }
}

module.exports = AddressController;
