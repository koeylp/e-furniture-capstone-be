const uuid = require("uuid");

const generateOrderCode = () => {
  const orderId = uuid.v4();
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10).replace(/-/g, "");
  const orderCode = "EFUR" + formattedDate + "-" + orderId.slice(0, 8).toUpperCase();

  return orderCode;
};

module.exports = {generateOrderCode}
