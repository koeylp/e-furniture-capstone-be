const StatisticService = require("../services/statisticService");
const { OK } = require("../utils/successHandler");
class StatisticController {
  static async getStatistic(req, res) {
    return new OK({
      message: "Statistic!",
      metaData: await StatisticService.getStatisticValue(),
    }).send(res);
  }
  static async getOrdersIn7daysAgo(req, res) {
    return new OK({
      message: "List Of Order In 7 Days Ago!",
      metaData: await StatisticService.getOrdersIn7days(),
    }).send(res);
  }
}
module.exports = StatisticController;
