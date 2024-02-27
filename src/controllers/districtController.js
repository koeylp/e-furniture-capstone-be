const DistrictService = require("../services/districtService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
class DistrictController {
  static async createDistrict(req, res) {
    return new OK({
      message: "Create District Successfully!",
      metaData: await DistrictService.createDistrict(req.body),
    }).send(res);
  }
  static async findDistrictById(req, res) {
    const { district_id } = req.params;
    if (!district_id) throw new BadRequestError();
    return new OK({
      message: "District Detail!",
      metaData: await DistrictService.findDistrictById(district_id),
    }).send(res);
  }
  static async getAllDistricts(req, res) {
    return new OK({
      message: "List Of Districts!",
      metaData: await DistrictService.getAllDistricts(),
    }).send(res);
  }
  static async increaseDistrict(req, res) {
    const { district_id } = req.params;
    if (!district_id) throw new BadRequestError();
    const { number } = req.body;
    return new OK({
      message: "Increase Districts Total Successfully!",
      metaData: await DistrictService.increaseOrderOfDistrict(
        district_id,
        number
      ),
    }).send(res);
  }
  static async decreaseDistrict(req, res) {
    const { district_id } = req.params;
    if (!district_id) throw new BadRequestError();
    const { number } = req.body;
    return new OK({
      message: "Decrease Districts Total Successfully!",
      metaData: await DistrictService.decreaseOrderOfDistrict(
        district_id,
        number
      ),
    }).send(res);
  }
  static async updateDistrict(req, res) {
    const { district_id } = req.params;
    if (!district_id) throw new BadRequestError();
    return new OK({
      message: "Update Districts Successfully!",
      metaData: await DistrictService.updateDistrict(district_id, req.body),
    }).send(res);
  }
}
module.exports = DistrictController;
