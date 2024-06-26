"use strict";
const mongoose = require("mongoose");
const { NotFoundError, BadRequestError } = require("./errorHanlder");
const crypto = require("crypto");

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (
      obj[k] === null ||
      obj[k] === undefined ||
      (Array.isArray(obj[k]) && obj[k].length === 0)
    ) {
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
  if (!mongoose.Types.ObjectId.isValid(_id))
    throw new NotFoundError(`id ${_id} does not exist`);
};
const checkMinNumber = ({ value, min }) => {
  if (value <= min)
    throw new BadRequestError(`Number Should Greater Than ${min}`);
};
const checkMaxNumber = ({ value, max }) => {
  if (value > min)
    throw new BadRequestError(`Number Should Greater Than ${min}`);
};
const checkRoleNumber = (role) => {
  return role % 2 === 0;
};
const handleProducts = (products) => {
  const productMap = {};
  for (const product of products) {
    const productId = product._id;
    if (productMap.hasOwnProperty(productId)) {
      productMap[productId].quantity += product.quantity;
    } else {
      productMap[productId] = { ...product };
    }
  }
  return Object.values(productMap);
};
const defaultVariation = (item) => {
  let index = item.properties.findIndex((property) => property.stock > 0);
  if (index == -1)
    return {
      variation_id: item._id,
      property_id: item.properties[0]._id,
      sub_price: item.properties[0].sub_price,
      stock: item.properties[0].stock,
    };
  return {
    variation_id: item._id,
    property_id: item.properties[index]._id,
    sub_price: item.properties[index].sub_price,
    stock: item.properties[index].stock,
  };
};

const valueVariationWithProperty = (item_id, variation) => {
  let index = variation.properties.findIndex(
    (property) => property._id.toString() == item_id
  );
  if (index == -1) return {};
  return {
    variation_id: variation._id,
    property_id: variation.properties[index]._id,
    sub_price: variation.properties[index].sub_price,
    color: variation.properties[index].value,
    stock: variation.properties[index].stock,
  };
};
function removeDuplicates(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return [];
  }
  return Array.from(new Set(arr));
}
function convertAttributes(attributes) {
  return attributes.map((attribute) => {
    const { _id, ...rest } = attribute._id;
    return { _id, ...rest };
  });
}
function createCode(product_id, propertyId) {
  const code = crypto
    .createHash("sha256")
    .update(product_id + propertyId)
    .digest("hex")
    .slice(0, 20);
  return code;
}

const generateVariations = (arrays) => {
  const result = [];

  function generateCombinations(currentCombination, remainingArrays) {
    if (remainingArrays.length === 0) {
      result.push(currentCombination);
      return;
    }

    for (let i = 0; i < remainingArrays[0].length; i++) {
      const newCombination = [...currentCombination, remainingArrays[0][i]];
      generateCombinations(newCombination, remainingArrays.slice(1));
    }
  }

  generateCombinations([], arrays);

  return result;
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
  checkRoleNumber,
  handleProducts,
  removeDuplicates,
  convertAttributes,
  defaultVariation,
  createCode,
  valueVariationWithProperty,
  generateVariations,
};
