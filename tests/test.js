const cron = require("node-cron");
const moment = require("moment");
const cronJobsMap = new Map();
const processDateRange = (startDate, endDate, products) => {
  const momentStartDate = moment(startDate);
  const cronJob = cron.schedule(
    `21 19 ${momentStartDate.format("D")} ${momentStartDate.format("M")} *`,
    () => {
      console.log("Thực hiện công việc tại 12h ngày startDate");
    }
  );
  cronJobsMap.set(startDate, cronJob);
  console.log(cronJobsMap);
  // cronJob.stop();
  // console.log(cronJob);
};
const stopCronJob = (cronJobId) => {
  if (cronJobsMap.has(cronJobId)) {
    const cronJobToStop = cronJobsMap.get(cronJobId);
    cronJobToStop.stop();
    cronJobsMap.delete(cronJobId);
  }
  console.log(cronJobsMap);
};
// Sử dụng hàm với giá trị startDate, endDate và products cụ thể
const startDateValue = "2024-03-05"; // Đặt giá trị startDate mong muốn
const startDateValue2 = "2024-03-06"; // Đặt giá trị startDate mong muốn
const startDateValue3 = "2024-03-07"; // Đặt giá trị startDate mong muốn
const endDateValue = "2024-03-05"; // Đặt giá trị endDate mong muốn
const productsToAdjust = [];

// Gọi hàm và truyền giá trị startDate, endDate và products
// processDateRange(startDateValue, endDateValue, productsToAdjust);
// processDateRange(startDateValue2, endDateValue, productsToAdjust);
// processDateRange(startDateValue3, endDateValue, productsToAdjust);
stopCronJob(startDateValue2);
