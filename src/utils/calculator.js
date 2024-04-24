const calculateOrderTotal = (products) => {
  let order_total = 0;
  products.forEach((el) => {
    order_total += el.price * el.quantity;
  });
  return order_total;
};

const calculateAmountRefund = (amount) => {
  return (amount * 90) / 100;
};

module.exports = { calculateOrderTotal, calculateAmountRefund };
