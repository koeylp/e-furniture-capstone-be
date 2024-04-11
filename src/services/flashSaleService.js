const FlashSaleRepository = require("../models/repositories/flashSaleRepository");
const FlashSaleUtils = require("../utils/flashSaleUtils");
const CronFactory = require("../services/cronFactory/cron");
const { NotFoundError } = require("../utils/errorHanlder");
class FlashSaleService {
  static async create(payload) {
    FlashSaleUtils.validateDate(payload.startDay, payload.endDay);
    payload.startDay = FlashSaleUtils.convertToDate(payload.startDay);
    payload.endDay = FlashSaleUtils.convertToDate(payload.endDay);
    await FlashSaleUtils.validateProducts(payload.products);
    const result = await FlashSaleRepository.createFlashSale(payload);
    await this.startFlashSaleCron(result);
    return result;
  }

  static async getFlashSales() {
    return await FlashSaleRepository.getFlashSales();
  }

  static async findFlashSaleById(flashSale_id) {
    return await FlashSaleRepository.findFlashSaleById(flashSale_id);
  }

  static async getTodayFlashSales() {
    const { today, now, tomorrow } = FlashSaleUtils.getTodayAndTomorowDay();
    const query = {
      $and: [
        { startDay: { $gte: today } },
        { startDay: { $gte: now } },
        { startDay: { $lte: tomorrow } },
      ],
    };
    const flashSales = await FlashSaleRepository.getFlashSales(query);
    let array = Object.entries(
      flashSales.reduce((acc, flashSale) => {
        const hour = FlashSaleUtils.getHourByDate(flashSale.startDay);
        acc[hour] = (acc[hour] || []).concat(flashSale);
        return acc;
      }, {})
    ).map(([hour, flashSales]) => ({
      Hour: hour,
      FlashSales: flashSales,
    }));
    array.sort((a, b) => {
      return parseFloat(a.Hour) - parseFloat(b.Hour);
    });
    return array;
  }

  static async getFlashSaleFuture() {
    const { today, tomorrow } = FlashSaleUtils.getTodayAndTomorowDay();
    const query = {
      startDay: { $gte: tomorrow },
    };
    return await FlashSaleRepository.getFlashSalesWithoutPopulate(query);
  }

  static async update(flashSale_id, payload) {
    FlashSaleUtils.validateDate(payload.startDay, payload.endDay);
    await FlashSaleUtils.validateProducts(payload.products);
    return await FlashSaleRepository.updateById(flashSale_id, payload);
  }

  static async publish(flashSale_id) {
    const result = await FlashSaleRepository.publishFlashSale(flashSale_id);
    if (result.modifiedCount < 0)
      throw new NotFoundError("Cannot Update FlashSale!");
    const flashSale = await FlashSaleRepository.findFlashSaleById(flashSale_id);
    await this.startFlashSaleCron(flashSale);
    return result;
  }

  static async startFlashSaleCron(flashSale) {
    const cronJob = await FlashSaleUtils.processDateRange(
      flashSale.startDay,
      flashSale.endDay,
      flashSale.products,
      flashSale._id.toString()
    );
    CronFactory.registerCronType(
      `${flashSale._id.toString()}_start`,
      cronJob.start
    );
    CronFactory.registerCronType(
      `${flashSale._id.toString()}_end`,
      cronJob.end
    );
  }

  static async checkDate(flashSale_id) {
    const { today, now, tomorrow } = FlashSaleUtils.getTodayAndTomorowDay();
    const flashSale = await FlashSaleRepository.findFlashSaleById(flashSale_id);
    const result = FlashSaleUtils.checkDateProgress(
      flashSale.startDay,
      flashSale.endDay
    );
    return {
      result,
      today,
      now,
      tomorrow,
      startDay: FlashSaleUtils.convertToDate(flashSale.startDay),
      endDay: FlashSaleUtils.convertToDate(flashSale.endDay),
    };
  }

  static async startFlashSaleChecking(flashSale_id, startDay, endDay) {
    const flashSale = await FlashSaleRepository.findFlashSaleById(flashSale_id);
    const cronJob = await FlashSaleUtils.processDateRangeChecking(
      flashSale_id,
      flashSale.startDay,
      flashSale.endDay
    );
    return cronJob;
  }

  static async endFlashSaleCron(flashSale_id) {
    const cronStart = CronFactory.cronRegistry[`${flashSale_id}_start`];
    const cronEnd = CronFactory.cronRegistry[`${flashSale_id}_end`];
    cronStart.stop();
    cronEnd.stop();
    CronFactory.unregisterCronType(`${flashSale_id}_start`);
    CronFactory.unregisterCronType(`${flashSale_id}_end`);
  }

  static async draft(flashSale_id) {
    const result = await FlashSaleRepository.draftFlashSale(flashSale_id);
    if (result.modifiedCount < 1) throw new NotFoundError();
    await FlashSaleRepository.findFlashSaleById(flashSale_id);
    await this.endFlashSaleCron(flashSale_id);
    return result;
  }

  static async remove(flashSale_id) {
    CronFactory.unregisterCronType(`${flashSale_id}_start`);
    CronFactory.unregisterCronType(`${flashSale_id}_end`);
    return await FlashSaleRepository.remove(flashSale_id);
  }
}
module.exports = FlashSaleService;
