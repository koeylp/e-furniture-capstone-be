const RevenueRepository = require("../models/repositories/revenueRepository");
const { parseDate } = require("../utils/dateHandler");
const { BadRequestError } = require("../utils/errorHanlder");
class RevenueService {
  static async addRevenue(profit, day = new Date().setUTCHours(0, 0, 0, 0)) {
    if (profit < 0) throw new BadRequestError("Profit must greater than 0!");
    return await RevenueRepository.updateOrInsert(profit, day);
  }
  static async getRevenueToday() {
    const query = {
      date: new Date().setUTCHours(0, 0, 0, 0),
    };
    return await RevenueRepository.findRevenue(query);
  }
  static async getRevenueByDate(day) {
    day = parseDate(day);
    const query = {
      date: day,
    };
    return await RevenueRepository.findRevenue(query);
  }
  static async getRevenueByDateRange(startDay, endDay) {
    startDay = parseDate(startDay);
    endDay = parseDate(endDay);
    if (startDay > endDay)
      throw new BadRequestError("Start Date must before End Date!");
    let query = {
      date: { $gte: startDay, $lte: endDay },
      status: 1,
    };
    const listRevenue = await RevenueRepository.getRevenues(query);
    if (listRevenue.length == 0) return { sum: 0, data: listRevenue };
    const sumRevenue = listRevenue.reduce((acc, revenue) => {
      return acc + revenue.profit;
    }, 0);
    return { sum: sumRevenue, data: listRevenue };
  }
  static async getRevenueByDate(day) {
    day = parseDate(day);
    const query = {
      date: day,
      status: 1,
    };
    return await RevenueRepository.findRevenue(query);
  }
  static async minusRevenue(profit, day = new Date().setUTCHours(0, 0, 0, 0)) {
    if (profit < 0) throw new BadRequestError("Profit must greater than 0!");
    day = parseDate(day);
    let query = { date: day };
    let payload = {
      $inc: {
        profit: -profit,
      },
    };
    return await RevenueRepository.updateRevenue(query, payload);
  }
}
module.exports = RevenueService;
