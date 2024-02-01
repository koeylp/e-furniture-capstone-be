const cron = require("node-cron");
const moment = require("moment");

const processDateRange = (startDate, endDate, products) => {
  if (!startDate || !endDate) {
    console.error("Vui lòng cung cấp cả startDate và endDate");
    return;
  }
  const momentStartDate = moment(startDate);
  const momentEndDate = moment(endDate);
  if (momentStartDate.isAfter(momentEndDate)) {
    console.error("startDate không thể lớn hơn endDate");
    return;
  }
  console.log(
    `Khoảng thời gian từ ${momentStartDate.format(
      "YYYY-MM-DD"
    )} đến ${momentEndDate.format("YYYY-MM-DD")}`
  );
  cron.schedule(
    `49 10 ${momentStartDate.format("D")} ${momentStartDate.format("M")} *`,
    () => {
      console.log("Thực hiện công việc tại 12h ngày startDate");
    }
  );
  cron.schedule(
    `50 10 ${momentEndDate.format("D")} ${momentEndDate.format("M")} *`,
    () => {
      console.log("Thực hiện công việc tại 12h ngày endDate");
    }
  );
};

// Sử dụng hàm với giá trị startDate, endDate và products cụ thể
const startDateValue = "2024-02-01"; // Đặt giá trị startDate mong muốn
const endDateValue = "2024-02-01"; // Đặt giá trị endDate mong muốn
const productsToAdjust = [];

// Gọi hàm và truyền giá trị startDate, endDate và products
processDateRange(startDateValue, endDateValue, productsToAdjust);
