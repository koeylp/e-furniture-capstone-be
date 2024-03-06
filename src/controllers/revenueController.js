const RevenueService = require("../services/revenueService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
class RevenueController {
  static async addRevenue(req, res) {
    const { profit, day } = req.body;
    if (!profit) throw new BadRequestError();
    return new OK({
      message: "Add Revenue Successfully!",
      metaData: await RevenueService.addRevenue(profit, day),
    }).send(res);
  }
  static async minusRevenue(req, res) {
    const { profit, day } = req.body;
    if (!profit) throw new BadRequestError();
    return new OK({
      message: "Minus Revenue Successfully!",
      metaData: await RevenueService.minusRevenue(profit, day),
    }).send(res);
  }
  static async getRevenueByDay(req, res) {
    const { day } = req.body;
    if (!day) throw new BadRequestError();
    return new OK({
      message: "Revenue By Day!",
      metaData: await RevenueService.getRevenueByDate(day),
    }).send(res);
  }
  static async getRevenueToday(req, res) {
    return new OK({
      message: "Revenue ToDay!",
      metaData: await RevenueService.getRevenueToday(),
    }).send(res);
  }
  static async getRevenueByRange(req, res) {
    const { startDay, endDay } = req.body;
    if (!startDay || !endDay) throw new BadRequestError();
    return new OK({
      message: "Revenue By Range!",
      metaData: await RevenueService.getRevenueByDateRange(startDay, endDay),
    }).send(res);
  }
}
module.exports = RevenueController;
