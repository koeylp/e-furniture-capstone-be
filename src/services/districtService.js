const DistrictRepository = require("../models/repositories/districtRepository");
const { BadRequestError } = require("../utils/errorHanlder");

class DistrictService {
  static async createDistrict(payload) {
    return await DistrictRepository.createDistrict(payload);
  }
  static async findDistrictById(district_id) {
    return await DistrictRepository.findDistrictById(district_id);
  }
  static async getAllDistricts() {
    return await DistrictRepository.getDistricts();
  }
  static async increaseOrderOfDistrict(district_id, number = 1) {
    if (isNaN(number))
      throw new BadRequestError("Cannot increase with invalid number!");
    const district = await DistrictRepository.findDistrictById(district_id);
    district.totalOrder += number;
    return await DistrictRepository.save(district);
  }
  static async decreaseOrderOfDistrict(district_id, number = 1) {
    if (isNaN(number))
      throw new BadRequestError("Cannot increase with invalid number!");
    const district = await DistrictRepository.findDistrictById(district_id);
    district.totalOrder -= number;
    district.totalOrder = district.totalOrder <= 0 ? 0 : district.totalOrder;
    return await DistrictRepository.save(district);
  }
  static async updateDistrict(district_id, payload) {
    if (payload.totalOrder && payload.totalOrder < 0)
      throw new BadRequestError("Total Order cannot less than 0!");
    return await DistrictRepository.update(district_id, payload);
  }
  static async increaseOrderOfDistrictByName(district_name) {
    const district = await DistrictRepository.findDistrictByName(district_name);
    district.totalOrder += 1;
    return await DistrictRepository.save(district);
  }
}
module.exports = DistrictService;
