const ReportRepository = require("../models/repositories/reportRepository");
const TransactionService = require("./transactionService");
const RevenueService = require("./revenueService");
const OrderService = require("./orderSerivce");

class ReportService {
  static async create(payload) {
    return await ReportRepository.create(payload);
  }

  static async createRefundReport(payload, order, account) {
    let report = {
      requester: {
        account_number: payload.account_number,
        bank_account_name: payload.bank_account_name,
        bank_code: payload.bank_code,
        bank_name: payload.bank_name,
        name: `${account.first_name} ${account.last_name}`,
        email: account.email,
      },
      note: `Refund Order Code: ${order.order_code}, Reason: ${payload.reason}`,
      amount: order.order_checkout.final_total,
    };
    return await this.create(report);
  }

  static async getReports(page = 1, limit = 12) {
    return await ReportRepository.getReports({ page, limit });
  }

  static async getReportByState(state, page = 1, limit = 12) {
    return await ReportRepository.getReportsByState({ state, page, limit });
  }

  static async confirmReport(report_id, thumbs) {
    const report = await ReportRepository.findReportById(report_id);
    let { code, reason } = this.getOrderCodeAndReason(report.note);
    await this.updateState(report_id, thumbs);
    return { code, reason, report, amount: report.amount };
  }

  static getOrderCodeAndReason(note) {
    let first = note.split(",");
    let firstSplit = first[0].split("Code: ");
    let secondSplit = first[1].split("Reason: ");
    return { code: firstSplit[1], reason: secondSplit[1] };
  }

  static async updateState(report_id, thumbs, state = 1) {
    const payload = {
      $set: {
        status: state,
        thumbs: thumbs,
      },
    };
    return await ReportRepository.updateById(report_id, payload);
  }
}
module.exports = ReportService;
