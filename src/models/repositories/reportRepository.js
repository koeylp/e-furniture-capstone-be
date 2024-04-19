const _Report = require("../reportModel");
const {
  InternalServerError,
  NotFoundError,
} = require("../../utils/errorHanlder");
const { checkValidId, removeUndefineObject } = require("../../utils/index");
const { default: mongoose } = require("mongoose");

class ReportRepository {
  static async create(payload) {
    const result = await _Report.create(payload);
    if (!result) throw new InternalServerError();
    return result;
  }

  static async findReport(query) {
    return await _Report.findOne(query).lean();
  }

  static async getReports({ query = {}, page, limit }) {
    const skip = (page - 1) * limit;
    return await _Report.find(query).skip(skip).limit(limit).lean();
  }

  static async getReportsByState({ state, page, limit }) {
    const skip = (page - 1) * limit;
    const query = {
      status: state,
    };
    return await _Report.find(query).skip(skip).limit(limit).lean();
  }

  static async findReportById(request_id) {
    checkValidId(request_id);
    const query = {
      _id: new mongoose.Types.ObjectId(request_id),
    };
    const result = await this.findReport(query);
    if (!result) throw new NotFoundError();
    return result;
  }

  static async update(query, payload) {
    payload = removeUndefineObject(payload);
    return await _Report.updateOne(query, payload, { new: true });
  }

  static async delete(query) {
    return await _Report.deleteOne(query);
  }

  static async updateById(request_id, payload) {
    checkValidId(request_id);
    const query = {
      _id: new mongoose.Types.ObjectId(request_id),
    };
    return await this.update(query, payload);
  }
}
module.exports = ReportRepository;
