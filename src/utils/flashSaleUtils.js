const cron = require("node-cron");
const moment = require("moment");
const { BadRequestError, NotFoundError } = require("./errorHanlder");
const ProductRepository = require("../models/repositories/productRepository");
const ProductService = require("../services/productService");
require("moment-timezone");

class FlashSaleUtils {
  static getTodayAndTomorowDay() {
    const midnightVN = moment()
      .startOf("day")
      .add(7, "hours")
      .format("YYYY-MM-DDTHH:mm:ss");
    const tomorrowVN = moment(midnightVN)
      .add(1, "days")
      .format("YYYY-MM-DDTHH:mm:ss");
    return { today: new Date(midnightVN), tomorrow: new Date(tomorrowVN) };
  }

  static convertToDate(day) {
    // const date = new Date(day);
    // const [dateString, timeString] = day.split(" ");

    // // Parse the date part
    // const milliseconds = Date.parse(dateString);
    // const date = new Date(milliseconds);

    // // Extract hour and minute (assuming format HH:MM)
    // const [hour, minute] = timeString.split(":");

    // // Set hour and minute on the date object
    // date.setHours(hour, minute);

    // // date.setHours(date.getHours() + 7);
    const date = new Date(day);
    // date.setHours(date.getHours() + 7);
    return date;
  }

  static convertDateToString(date) {
    const result = moment(new Date(date)).tz("UTC");
    return result.format("YYYY-MM-DDTHH:mm:ss");
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
    if (startDate < currentDate)
      throw new BadRequestError(
        "The start time must be later than the current time!"
      );
    if (endDate < currentDate)
      throw new BadRequestError(
        "The end time must be later than the current time!"
      );
  }

  static async validateProducts(products) {
    await Promise.all(
      products.map(async (product) => {
        await ProductRepository.findProductById(product.productId);
        if (product.count <= 0) {
          throw new BadRequestError(
            "The quantity of products to be sold must be greater than 0!"
          );
        }
        if (product.salePrice < 0) {
          throw new BadRequestError("The Sale Price must be positive!");
        }
      })
    );
  }

  static async processDateRange(startDate, endDate, products) {
    if (!startDate || !endDate) {
      throw new BadRequestError("Vui lòng cung cấp cả startDate và endDate");
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
        console.log(
          `Thực hiện công việc tại ${startTime.hour} ${
            startTime.minute
          } ngày ${startTime.momentDate.format("YYYY-MM-DD")}`
        );
        // await ProductService.updateRangeProductSalePrice(products);
      }
    );
    const endCron = cron.schedule(
      `${endTime.minute} ${endTime.hour}
       ${endTime.momentDate.format("D")}
       ${endTime.momentDate.format("M")} *`,
      async () => {
        // await ProductService.reRangeProductSalePrice(products);
        console.log(
          `Thực hiện công việc tại ${endTime.hour} ${
            endTime.minute
          } ngày ${endTime.momentDate.format("YYYY-MM-DD")}`
        );
      }
    );
    return { start: startCron, end: endCron };
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
    const day = this.convertDateToString(date);
    const { hour, minute, momentDate } = this.convertTimeDate(day);
    return hour;
  }
}
module.exports = FlashSaleUtils;

// const date = new Date(payload.startDay);
// console.log(date);
// date.setHours(date.getHours() + 7);
// console.log(date);

// // Convert timestamp to a Moment object
// const date2 = moment(date);

// // Format the Moment object to the desired format
// const formattedTimestamp = date2.format("YYYY-MM-DD:HH:mm:ss");

// console.log(formattedTimestamp);
