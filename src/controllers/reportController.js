const ReportService = require("../services/reportService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");

class ReportController {
  static async getReports(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Reports",
      metaData: await ReportService.getReports(page, limit),
    }).send(res);
  }

  static async getReportsByState(req, res) {
    const { state, page, limit } = req.query;
    let result;
    if (state) {
      result = await ReportService.getReportByState(state, page, limit);
    } else {
      result = await ReportService.getReports(page, limit);
    }
    return new OK({
      message: "List Of Reports",
      metaData: result,
    }).send(res);
  }

  static async confirmReport(req, res) {
    const { report_id } = req.params;
    if (!report_id) throw new BadRequestError();
    return new OK({
      message: "List Of Reports",
      metaData: await ReportService.confirmReport(report_id),
    }).send(res);
  }
}
module.exports = ReportController;
