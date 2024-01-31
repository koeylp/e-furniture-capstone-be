// const getProducts = (page = 1, limit = 12, subTypes) => {
//   let skip = (page - 1) * limit;
//   let productResult = [];
//   for (var { products } of subTypes) {
//     if (products.length <= skip) {
//       skip = skip - products.length;
//       continue;
//     }
//     let productPush = products.length - skip;
//     if (productPush == 0) continue;
//     if (productPush >= limit) {
//       let productResult1 = products.slice(skip);
//       productResult1 = products.slice(0, limit);
//       productResult = [...productResult, ...productResult1];
//       return productResult;
//     }
//     limit = limit - productPush;
//     productResult = [...productResult, ...products.slice(0, productPush)];
//     skip = 0;
//   }
//   return productResult;
// };
const subTypesData = [
  {
    _id: "subType1Id",
    type: "type1",
    slug: "subType1",
    products: [
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
    ],
  },
  {
    _id: "subType1Id",
    type: "type1",
    slug: "subType1",
    products: [
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
    ],
  },
  {
    _id: "subType1Id",
    type: "type1",
    slug: "subType1",
    products: [
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
    ],
  },
  {
    _id: "subType1Id",
    type: "type1",
    slug: "subType1",
    products: [
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
    ],
  },
  {
    _id: "subType1Id",
    type: "type1",
    slug: "subType1",
    products: [
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
    ],
  },
  {
    _id: "subType1Id",
    type: "type1",
    slug: "subType1",
    products: [
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
      { _id: "product1Id", name: "Product 1", price: 20 },
      { _id: "product2Id", name: "Product 2", price: 25 },
    ],
  },
];

const getProducts = (page = 1, limit = 12, subTypes) => {
  let skip = (page - 1) * limit;
  let productResult = [];
  for (const { products } of subTypes) {
    if (products.length <= skip) {
      skip -= products.length;
      continue;
    }
    const productPush = Math.max(products.length - skip, 0);
    if (productPush === 0) continue;
    if (productPush >= limit) {
      productResult.push(...products.slice(skip, skip + limit));
      return productResult;
    }
    limit -= productPush;
    productResult.push(...products.slice(skip, skip + productPush));
    skip = 0;
  }
  return productResult;
};
const product = getProducts((page = 8), (limit = 12), subTypesData);
console.log(product);
