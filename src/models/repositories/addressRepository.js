const { default: mongoose } = require("mongoose");
const _Address = require("../addressModel");
const {
  InternalServerError,
  BadRequestError,
} = require("../../utils/errorHanlder");
const {
  checkValidId,
  getUnSelectData,
  removeUndefineObject,
} = require("../../utils");
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
      is_default: true,
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
