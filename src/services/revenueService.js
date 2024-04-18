const OrderRepository = require("../models/repositories/orderRepository");
const RevenueRepository = require("../models/repositories/revenueRepository");
const { parseDate } = require("../utils/dateHandler");
const { BadRequestError } = require("../utils/errorHanlder");

class RevenueService {
  static async addRevenue(profit, day = new Date().setUTCHours(0, 0, 0, 0)) {
    this.validateRevenue(profit);
    let query = {
      date: day,
    };

    return await RevenueRepository.updateOrInsert(query, profit);
  }

  static async addRevenueOrder(order_id, order_amount) {
    const order = await OrderRepository.findOrderById({ order_id: order_id });
    let deposit = order.order_checkout.paid.paid_amount;
    let profit = deposit + order_amount;
    return await this.addRevenue(profit);
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

  static async decreaseProfit(revenue_id, profit) {
    await this.validateRevenue(profit);
    const revenue = await RevenueRepository.findRevenueById(revenue_id);
    let updateProfit = revenue.profit - profit;
    revenue.profit = updateProfit < 0 ? 0 : updateProfit;
    return await RevenueRepository.save(revenue);
  }

  static async increaseprofit(revenue_id, profit) {
    await this.validateRevenue(profit);
    const revenue = await RevenueRepository.findRevenueById(revenue_id);
    revenue.profit += profit;
    return await RevenueRepository.save(revenue);
  }

  static async updateprofit(revenue_id, profit) {
    await this.validateRevenue(profit);
    const revenue = await RevenueRepository.findRevenueById(revenue_id);
    revenue.profit = profit;
    return await RevenueRepository.save(revenue);
  }

  static async validateRevenue(profit) {
    if (profit < 0) throw new BadRequestError("Profit must greater than 0!");
  }
}
module.exports = RevenueService;
