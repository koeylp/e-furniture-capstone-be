const { default: mongoose } = require("mongoose");
const _Address = require("../addressModel");
const {
  InternalServerError,
  BadRequestError,
} = require("../../utils/errorHanlder");
const { checkValidId, getUnSelectData } = require("../../utils");
class AddressRepository {
  static async getAddressById(address_id) {
    checkValidId(address_id);
    const query = {
      _id: new mongoose.Types.ObjectId(address_id),
    };
    const address = await _Address.findOne(query);
    if (!address) throw new BadRequestError("Cannot Find Any Address!");
    return address;
  }
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
  static async getAddressByAccountId(account_id) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await _Address.find(query).sort({ _id: 1 });
  }
  static async getAccountDefaultAddress(account_id) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      isDefault: true,
    };
    return await _Address
      .findOne(query)
      .select(getUnSelectData(["__v"]))
      .lean()
      .exec();
  }
  static async setAddressNotDefault(account_id) {
    checkValidId(account_id);
    const query = {
      account_id: new mongoose.Types.ObjectId(account_id),
      isDefault: true,
    };
    const update = {
      $set: { isDefault: false },
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
      $set: { isDefault: true },
    };
    return await _Address.updateMany(query, update, { isNew: true });
  }
  static async editAddress(address_id, payload) {
    checkValidId(account_id);
    const address = await this.getAddressById(address_id);
    address.phone = payload.phone;
    address.province = payload.province;
    address.district = payload.district;
    address.ward = payload.ward;
    address.address = payload.address;
    return await _Address.updateOne(address);
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
