const OrderService = require("../services/orderSerivce");
const ReportService = require("../services/reportService");
const RevenueService = require("../services/revenueService");
const TransactionService = require("../services/transactionService");
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
    return new OK({
      message: "List Of Reports",
      metaData: await ReportService.getReportByState(state, page, limit),
    }).send(res);
  }

  static async confirmReport(req, res) {
    const { report_id } = req.params;
    const { thumbs } = req.body;
    if (!report_id || !thumbs) throw new BadRequestError();
    let result = await ReportService.confirmReport(report_id, thumbs);
    await OrderService.refundOrder(result.code, thumbs);
    await TransactionService.createRefundTransaction(result.report);
    await RevenueService.addRevenue(-result.amount);
    return new OK({
      message: "List Of Reports",
      metaData: result,
    }).send(res);
  }
}
module.exports = ReportController;
