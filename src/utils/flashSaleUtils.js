const cron = require("node-cron");
const moment = require("moment");
const { BadRequestError, NotFoundError } = require("./errorHanlder");
const ProductRepository = require("../models/repositories/productRepository");
const ProductService = require("../services/productService");

class FlashSaleUtils {
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
      console.error("Vui lòng cung cấp cả startDate và endDate");
      return;
    }
    const startTime = FlashSaleUtils.convertTimeDate(startDate);
    const endTime = FlashSaleUtils.convertTimeDate(endDate);
    console.log(startTime, endTime);
    console.log(
      `Khoảng thời gian từ ${startTime.momentDate.format(
        "YYYY-MM-DD"
      )} đến ${endTime.momentDate.format("YYYY-MM-DD")}`
    );
    cron.schedule(
      `${startTime.minute} ${startTime.hour}
       ${startTime.momentDate.format("D")}
       ${startTime.momentDate.format("M")} *`,
      async () => {
        await ProductService.updateRangeProductSalePrice(products);
        console.log(
          `Thực hiện công việc tại ${startTime.hour} ${
            startTime.minute
          } ngày ${startTime.momentDate.format("YYYY-MM-DD")}`
        );
      }
    );
    cron.schedule(
      `${endTime.minute} ${endTime.hour}
       ${endTime.momentDate.format("D")}
       ${endTime.momentDate.format("M")} *`,
      async () => {
        await ProductService.reRangeProductSalePrice(products);
        console.log(
          `Thực hiện công việc tại ${endTime.hour} ${
            endTime.minute
          } ngày ${endTime.momentDate.format("YYYY-MM-DD")}`
        );
      }
    );
  }
  static convertTimeDate(date) {
    const timeArray = date.split(":");
    const hour = timeArray[1];
    const minute = timeArray[2];

    const momentDate = moment(date);
    return { hour, minute, momentDate };
  }
}
module.exports = FlashSaleUtils;
