const { default: mongoose } = require("mongoose");
const { checkValidId, removeUndefineObject } = require("../../utils");
const { InternalServerError } = require("../../utils/errorHanlder");
const _District = require("../districtModel");
class DistrictRepository {
  static async createDistrict(payload) {
    const district = await _District.create(payload);
    if (!district) throw new InternalServerError();
    return district;
  }
  static async findDistrict(query) {
    const district = await _District.findOne(query).lean();
    return district;
  }
  static async findDistrictById(district_id) {
    checkValidId(district_id);
    const query = {
      _id: new mongoose.Types.ObjectId(district_id),
      status: 1,
    };
    return await this.findDistrict(query);
  }
  static async findDistrictByName(name) {
    const query = {
      name: name,
      status: 1,
    };
    return await this.findDistrict(query);
  }
  static async getDistricts() {
    return await _District.find().lean();
  }
  static async save(district) {
    return await _District.findByIdAndUpdate(district._id, district, {
      new: true,
    });
  }
  static async update(district_id, payload) {
    checkValidId(district_id);
    const update = removeUndefineObject(payload);
    return await _District.findByIdAndUpdate(district_id, update, {
      new: true,
    });
  }
}
module.exports = DistrictRepository;
