"use strict";
const mongoose = require("mongoose");
const { NotFoundError, BadRequestError } = require("./errorHanlder");

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};
const removeInsideUndefineObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      const respone = removeUndefineObject(obj[k]);
      Object.keys(respone).forEach((a) => {
        final[`${k}.${a}`] = respone[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};
const calculateRating = (rating, n, newRating) => {
  const newAverageRating = (rating * n + newRating) / (n + 1);
  return Math.round(newAverageRating * 10) / 10;
};
const checkValidId = (_id) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) throw new NotFoundError();
};
const checkMinNumber = ({ value, min }) => {
  if (value <= min)
    throw new BadRequestError(`Number Should Greater Than ${min}`);
};
const checkMaxNumber = ({ value, max }) => {
  if (value > min)
    throw new BadRequestError(`Number Should Greater Than ${min}`);
};
const arrayProduct = (products) => {
  const productMap = {};
  for (const product of products) {
    const productId = product._id;
    if (!productMap[productId]) {
      productMap[productId] = { ...product };
    } else {
      productMap[productId].quantity += product.quantity;
    }
  }
  return Object.values(productMap);
};

module.exports = {
  getSelectData,
  getUnSelectData,
  removeUndefineObject,
  calculateRating,
  checkValidId,
  removeInsideUndefineObject,
  checkMinNumber,
  checkMaxNumber,
  arrayProduct,
};
