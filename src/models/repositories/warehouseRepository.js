const _WareHouse = require("../warehouse.Model");
const { checkValidId } = require("../../utils/index");
const { default: mongoose } = require("mongoose");
class WareHouseRepository {
  static async createWareHouse(product_id, location, stock) {
    return await _WareHouse.create({
      product_id,
      location,
      stock,
    });
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
}
module.exports = WareHouseRepository;
