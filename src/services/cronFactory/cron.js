class CronFactory {
  static cronRegistry = {};
  static registerCronType(cron_id, cronJob) {
    if (!CronFactory.cronRegistry[cron_id]) {
      CronFactory.cronRegistry[cron_id] = cronJob;
    }
  }
  static async unregisterCronType(cron_id) {
    if (CronFactory.cronRegistry[cron_id]) {
      delete CronFactory.cronRegistry[cron_id];
    }
  }
}
module.exports = CronFactory;
