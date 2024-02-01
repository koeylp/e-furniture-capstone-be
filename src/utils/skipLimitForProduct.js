const getProducts = (page = 1, limit = 12, subTypes) => {
  let skip = (page - 1) * limit;
  let productResult = [];
  for (var { products } of subTypes) {
    if (products.length <= skip) {
      skip = skip - products.length;
      continue;
    }
    let productPush = products.length - skip;
    if (productPush == 0) continue;
    if (productPush >= limit) {
      let productResult1 = products.slice(skip);
      productResult1 = products.slice(0, limit);
      productResult = [...productResult, ...productResult1];
      return productResult;
    }
    limit = limit - productPush;
    productResult = [
      ...productResult,
      ...products.slice(products.length - productPush),
    ];
    skip = 0;
  }
  return productResult;
};
const getProductsBySubType = (page = 1, limit = 12, subTypes) => {
  let skip = (page - 1) * limit;
  let productResult = [];
  if (subTypes.products.length < skip) return productResult;
  productResult = subTypes.products.slice(skip);
  return productResult.slice(0, limit);
};
module.exports = {
  getProducts,
  getProductsBySubType,
};
