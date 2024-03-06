const uuid = require("uuid");

const generateOrderCode = () => {
  const orderId = uuid.v4();
  const orderCode = "EFURNITURE-" + orderId.slice(0, 8).toUpperCase();

  return orderCode;
};

module.exports = {generateOrderCode}
