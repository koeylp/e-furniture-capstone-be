// src/utils/format.js
const _ = require("lodash");
const moment = require("moment");

const capitalizeFirstLetter = (str) => {
  return _.upperFirst(_.trim(str));
};

const dollarFormatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

const vndFormatCurrency = (amount) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  if (amount == null) {
    return formatter.format(0);
  }

  return formatter.format(amount);
};


const formatDate = (date, formatString = 'YYYY-MM-DD HH:mm:ss') => {
  if (!moment(date).isValid()) {
    return 'Invalid date';
  }
  return moment(date).format(formatString);
};

module.exports = {
  capitalizeFirstLetter,
  dollarFormatCurrency,
  vndFormatCurrency,
  formatDate
};
