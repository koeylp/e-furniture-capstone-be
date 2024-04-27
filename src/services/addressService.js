const AccountRepository = require("../models/repositories/accountRepository");
const AddressRepository = require("../models/repositories/addressRepository");
class AddressService {
  static async createAddress(account_id, payload) {
    payload.account_id = account_id;
    let addresses = await this.getAddressByUser(account_id);
    if (addresses.length == 0) {
      payload.is_default = true;
    }
    return await AddressRepository.createAddress(account_id, payload);
  }
  static async getAddressByUser(account_id) {
    return await AddressRepository.getAddressByAccountId(account_id);
  }
  static async getAddressDefault(account_id) {
    return await AddressRepository.getAccountDefaultAddress(account_id);
  }
  static async setAddressDefault(account_id, address_id) {
    await AddressRepository.setAddressNotDefault(account_id);
    return await AddressRepository.setAddressDefault(account_id, address_id);
  }
  static async editAddress(address_id, payload) {
    return await AddressRepository.editAddress(address_id, payload);
  }
  static async removeAddress(address_id) {
    await AddressRepository.getAddressById(address_id);
    return AddressRepository.removeAddress(address_id);
  }
  static async removeAllAccountAddress(account_id) {
    return AddressRepository.removeAllAddress(account_id);
  }
}
module.exports = AddressService;
