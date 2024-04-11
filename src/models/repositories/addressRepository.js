const { default: mongoose } = require("mongoose");
const _Address = require("../addressModel");
const {
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const { checkValidId, removeUndefineObject } = require("../../utils");
class AddressRepository {
  static async createAddress(account_id, payload) {
    checkValidId(account_id);
    const address = await _Address.create({
      account_id: new mongoose.Types.ObjectId(account_id),
      phone: payload.phone,
      province: payload.province,
      district: payload.district,
      ward: payload.ward,
      address: payload.address,
    });
    if (!address) throw new InternalServerError();
    return address;
  }
  static async findAddress(query) {
    const address = await _Address.findOne(query).populate({
      path: "account_id",
      select: "first_name last_name email",
    });
    if (!address) throw new NotFoundError("Cannot Find Any Address!");
    return address;
  }
  static async getAddresses(query) {
    const address = await _Address.find(query).populate({
      path: "account_id",
      select: "first_name last_name email",
    });
    return address;
  }
  static async getAddressById(address_id) {
    checkValidId(address_id);
    const query = {
      _id: new mongoose.Types.ObjectId(address_id),
    };
    return this.findAddress(query);
  }

  static async getAddressByAccountId(account_id) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await this.getAddresses(query);
  }
  static async getAccountDefaultAddress(account_id) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      is_default: true,
    };
    return await this.findAddress(query);
  }
  static async setAddressNotDefault(account_id) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      is_default: true,
    };
    const update = {
      $set: { is_default: false },
    };
    return await _Address.updateMany(query, update, { isNew: true });
  }
  static async setAddressDefault(account_id, address_id) {
    checkValidId(account_id);
    checkValidId(address_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      _id: new mongoose.Types.ObjectId(address_id),
    };
    const update = {
      $set: { is_default: true },
    };
    return await _Address.updateMany(query, update, { isNew: true });
  }
  static async editAddress(address_id, payload) {
    checkValidId(address_id);
    const update = removeUndefineObject(payload);
    return await _Address.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(address_id) },
      update,
      { new: true }
    );
  }
  static async removeAddress(address_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(address_id),
    };
    return await _Address.deleteOne(query);
  }
  static async removeAllAddress(account_id) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await _Address.deleteMany(query);
  }
}
module.exports = AddressRepository;
