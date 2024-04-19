const ReportRepository = require("../models/repositories/reportRepository");
class ReportService {
  static async create(payload) {
    return await ReportRepository.create(payload);
  }

  static async createRefundReport(payload, order) {
    let report = {
      requester: {
        account_number: payload.account_number,
        bank_account_name: payload.bank_account_name,
        bank_code: payload.bank_code,
        bank_name: payload.bank_name,
      },
      note: `Refund Order Code: ${order.order_code}, Reason: ${payload.reason}`,
      amount: order.order_checkout.paid.paid_amount,
    };
    return await this.create(report);
  }

  static async getReports(page = 1, limit = 12) {
    return await ReportRepository.getReports({ page, limit });
  }

  static async getReportByState(state, page = 1, limit = 12) {
    return await ReportRepository.getReportsByState({ state, page, limit });
  }

  static async confirmReport(report_id) {
    return await this.updateState(report_id);
  }

  static async updateState(report_id, state = 1) {
    const payload = {
      $set: {
        status: state,
      },
    };
    return await ReportRepository.updateById(report_id, payload);
  }
}
module.exports = ReportService;
