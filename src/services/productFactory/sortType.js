const sortType = new Map([
  ["price_asc", { price: 1 }],
  ["price_desc", { price: -1 }],
  ["rating_asc", { ratingAvarage: 1 }],
  ["rating_desc", { ratingAvarage: -1 }],
  ["name_asc", { name: 1 }],
  ["name_desc", { name: -1 }],
  ["default", { createdAt: -1 }],
]);
const returnSortType = (code) => {
  return sortType.get(code) || sortType.get("default");
};
module.exports = {
  returnSortType,
};
