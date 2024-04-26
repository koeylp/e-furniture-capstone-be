const cron = require("node-cron");
const moment = require("moment");
const { BadRequestError } = require("./errorHanlder");
const ProductRepository = require("../models/repositories/productRepository");
const FlashSaleRepository = require("../models/repositories/flashSaleRepository");
require("moment-timezone");
const MINUTE_THRESHOLD = 30;

class FlashSaleUtils {
  static getTodayAndTomorowDay() {
    const midnightVN = moment().startOf("day").format("YYYY-MM-DDTHH:mm:ss");
    const nowDate = moment().add(7, "hours").format("YYYY-MM-DDTHH:00:00");
    const nowDateNow = new Date();
    nowDateNow.setMinutes(0);
    const tomorrowVN = moment(midnightVN)
      .add(1, "days")
      .format("YYYY-MM-DDTHH:mm:ss");
    return {
      today: new Date(midnightVN),
      now: nowDate,
      tomorrow: new Date(tomorrowVN),
    };
  }

  static convertToDate(day) {
    const date = new Date(day);
    return date;
  }
  static convertToDateUTC(day) {
    const date = new Date(day);
    date.setTime(date.getTime() + 7 * 60 * 60 * 1000);
    return date;
  }

  static convertDateToString(date) {
    const result = moment(new Date(date)).subtract(7, "hours");
    return result.format("YYYY-MM-DDTHH:mm:ss");
  }
  static convertDateToStringUCL(date) {
    const result = moment(new Date(date));
    return result.format("YYYY-MM-DDTHH:mm:ss");
  }

  static validateDateCreate(startDate, endDate) {
    let currentDate = this.validateDate(startDate, endDate);
    if (startDate < currentDate)
      throw new BadRequestError(
        "The start time must be later than the current time!"
      );
  }
  static validateDate(startDate, endDate) {
    if (!startDate || !endDate) throw new BadRequestError("Date is required!");
    const currentDate = new Date();
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (endDate < startDate)
      throw new BadRequestError(
        "Invalid time range, the start time must be before the end time"
      );
    if (endDate < currentDate)
      throw new BadRequestError(
        "The end time must be later than the current time!"
      );
    const timeDifferenceInMinutes = Math.floor(
      (endDate - startDate) / (1000 * 60)
    );
    if (timeDifferenceInMinutes > MINUTE_THRESHOLD) {
      throw new BadRequestError(
        "The end time must be less than 30 minutes after the start time"
      );
    }
    return currentDate;
  }

  static async validateProducts(products) {
    await Promise.all(
      products.map(async (product) => {
        let productFound = await ProductRepository.findProductById(
          product.productId
        );
        // if (product.count < 0) {
        //   throw new BadRequestError(
        //     "The quantity of products to be sold must be greater than 0!"
        //   );
        // }
        if (product.salePrice < 0) {
          throw new BadRequestError("The Sale Price must be positive!");
        }
        product.oldSalePrice = productFound.sale_price;
      })
    );
    return products;
  }

  static async processDateRange(startDate, endDate, products, flashSale_id) {
    if (!startDate || !endDate) {
      throw new BadRequestError("Invalid startDate and endDate");
    }
    startDate = this.convertDateToString(startDate);
    endDate = this.convertDateToString(endDate);
    const startTime = FlashSaleUtils.convertTimeDate(startDate);
    const endTime = FlashSaleUtils.convertTimeDate(endDate);
    const startCron = cron.schedule(
      `${startTime.minute} ${startTime.hour}
       ${startTime.momentDate.format("D")}
       ${startTime.momentDate.format("M")} *`,
      async () => {
        await this.modifyStartFlashSale(flashSale_id, products);
        // await this.updateRangeProductSalePrice(products);
        // await this.updateFlashSaleState(flashSale_id, 1);
      }
    );
    const endCron = cron.schedule(
      `${endTime.minute} ${endTime.hour}
       ${endTime.momentDate.format("D")}
       ${endTime.momentDate.format("M")} *`,
      async () => {
        // await this.updateRangeProductWithOldSalePrice(products);
        // await this.updateFlashSaleState(flashSale_id, 2);
        await this.modifyStopFlashSale(flashSale_id, products);
      }
    );
    return { start: startCron, end: endCron };
  }

  static async processDateRangeChecking(
    flashSale_id,
    products,
    startDate,
    endDate
  ) {
    let count = 0;
    if (!startDate || !endDate) {
      throw new BadRequestError("Invalid startDate and endDate");
    }
    // startDate = this.convertDateToString(startDate);
    // endDate = this.convertDateToString(endDate);
    // console.log(startDate, endDate);
    const startTime = FlashSaleUtils.convertTimeDate(startDate);
    const endTime = FlashSaleUtils.convertTimeDate(endDate);
    const startCron = cron.schedule(
      `${startTime.minute} ${startTime.hour}
       ${startTime.momentDate.format("D")}
       ${startTime.momentDate.format("M")} *`,
      async () => {
        await this.updateRangeProductSalePrice(products);
        // await this.updateFlashSaleState(flashSale_id, 1);
        console.log("Run");
      }
    );
    const endCron = cron.schedule(
      `${endTime.minute} ${endTime.hour}
       ${endTime.momentDate.format("D")}
       ${endTime.momentDate.format("M")} *`,
      async () => {
        await this.updateRangeProductWithOldSalePrice(products);
        // await this.updateFlashSaleState(flashSale_id, 2);
        console.log("End");
      }
    );

    console.log(startCron._scheduler.timeMatcher.pattern);
    return {
      start: `${startTime.minute} ${
        startTime.hour
      } ${startTime.momentDate.format("D")} ${startTime.momentDate.format(
        "M"
      )} *`,
      starting: `Thực hiện công việc tại ${startTime.hour} ${
        startTime.minute
      } ngày ${startTime.momentDate.format("YYYY-MM-DD")}`,

      end: `${endTime.minute} ${endTime.hour} ${endTime.momentDate.format(
        "D"
      )} ${endTime.momentDate.format("M")} *`,
      ending: `Thực hiện công việc tại ${endTime.hour} ${
        endTime.minute
      } ngày ${endTime.momentDate.format("YYYY-MM-DD")}`,

      startTime,
      endTime,
      startCron: {
        time: startCron._scheduler.timeMatcher.pattern,
        timezone: startCron._scheduler.timeMatcher.timezone || "Đố Biết",
      },
      endCron: {
        time: endCron._scheduler.timeMatcher.pattern,
        timezone: endCron._scheduler.timeMatcher.timezone || "Đố Biết",
      },
      count,
    };
  }

  static checkDateProgress(startDate, endDate) {
    if (!startDate || !endDate) {
      throw new BadRequestError("Invalid startDate and endDate");
    }
    startDate = this.convertDateToString(startDate);
    endDate = this.convertDateToString(endDate);
    const startTime = FlashSaleUtils.convertTimeDate(startDate);
    startTime.A = startTime.momentDate.format("D");
    startTime.B = startTime.momentDate.format("M");
    const endTime = FlashSaleUtils.convertTimeDate(endDate);
    endTime.A = endTime.momentDate.format("D");
    endTime.B = endTime.momentDate.format("M");
    return {
      startTime,
      endTime,
    };
  }

  static convertTimeDate(date) {
    const dayTimeArray = date.split("T");
    const timeArray = dayTimeArray[1].split(":");
    const hour = timeArray[0];
    const minute = timeArray[1];
    const momentDate = moment(date);
    return { hour, minute, momentDate };
  }

  static getHourByDate(date) {
    const day = this.convertDateToStringUCL(date);
    const { hour, minute, momentDate } = this.convertTimeDate(day);
    return hour;
  }

  static async updateFlashSaleState(flashSale_id, state) {
    const payload = {
      status: state,
    };
    return await FlashSaleRepository.updateById(flashSale_id, payload);
  }

  static async updateRangeProductSalePrice(products) {
    await Promise.all(
      products.map(async (product) => {
        let update = {
          $set: {
            sale_price: product.salePrice,
          },
        };
        await ProductRepository.updateProductById(product.productId, update);
      })
    );
  }

  static async updateRangeProductWithOldSalePrice(products) {
    await Promise.all(
      products.map(async (product) => {
        let update = {
          $set: {
            sale_price: product.oldSalePrice,
          },
        };
        await ProductRepository.updateProductById(product.productId, update);
      })
    );
  }

  static async modifyStartFlashSale(flashSale_id, products) {
    await this.updateRangeProductSalePrice(products);
    await this.updateFlashSaleState(flashSale_id, 1);
  }

  static async modifyStopFlashSale(flashSale_id, products) {
    await this.updateRangeProductWithOldSalePrice(products);
    await this.updateFlashSaleState(flashSale_id, 2);
  }
}
module.exports = FlashSaleUtils;
