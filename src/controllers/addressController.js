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
    const { account_id } = req.params;
    if (!account_id) throw new BadRequestError();
    return new OK({
      message: "List Address By User!",
      metaData: await AddressService.getAddressByUser(account_id),
    }).send(res);
  }
}

module.exports = AddressController;
