const uuid = require("uuid");

const generateOrderCode = () => {
  const orderId = uuid.v4();
  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const orderCode =
    "EFUR" + formattedDate + "-" + orderId.slice(0, 8).toUpperCase();
  return orderCode;
};

const generateOrderCodePayOS = async (checkOrderCodeExists) => {
  let orderCode;
  let isUnique = false;
  do {
    orderCode = Math.floor(Math.random() * 9007199254740991);
    const isExists = await checkOrderCodeExists(orderCode);
    if (!isExists) {
      isUnique = true;
    }
  } while (!isUnique);
  return orderCode;
};

module.exports = { generateOrderCode, generateOrderCodePayOS };
