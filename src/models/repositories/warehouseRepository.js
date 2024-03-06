const _WareHouse = require("../warehouseModel");
const { checkValidId } = require("../../utils/index");
const { default: mongoose } = require("mongoose");
const { InternalServerError } = require("../../utils/errorHanlder");
class WareHouseRepository {
  static async createWareHouse(payload) {
    const warehouse = await _WareHouse.create({
      street: payload.street,
      district: payload.district,
      ward: payload.ward,
      province: payload.province,
      longitude: payload.longitude,
      latitude: payload.latitude,
      location: payload.location,
      stock: payload.stock,
    });
    if (!warehouse) throw new InternalServerError();
    return warehouse;
  }
  static async getWareHouse(page, limit) {
    const skip = (page - 1) * limit;
    return await _WareHouse.find().skip(skip).limit(limit).lean().exec();
  }
  static async findWareHouseByProduct(product_id) {
    checkValidId(product_id);
    const query = {
      product_id: new mongoose.Types.ObjectId(product_id),
    };
    return await _WareHouse.findOne(query).lean();
  }
  static async findWareHouseById(warehouse_id) {
    checkValidId(warehouse_id);
    const query = {
      _id: new mongoose.Types.ObjectId(warehouse_id),
    };
    return await _WareHouse.findOne(query).lean();
  }
  static async updateWareHouse(warehouse_id, update) {
    checkValidId(warehouse_id);
    const query = {
      _id: new mongoose.Types.ObjectId(warehouse_id),
    };
    const option = { new: true };
    return await _WareHouse.findOneAndUpdate(query, update, option);
  }
  static async removeWareHouse(warehouse_id) {
    checkValidId(warehouse_id);
    const query = {
      _id: new mongoose.Types.ObjectId(warehouse_id),
    };
    return await _WareHouse.deleteOne(query);
  }
  static async findByQuery(query) {
    return await _WareHouse.findOne(query).exec();
  }
  static async save(warehouse) {
    return await _WareHouse.updateOne({ _id: warehouse._id }, warehouse);
  }
}
module.exports = WareHouseRepository;
