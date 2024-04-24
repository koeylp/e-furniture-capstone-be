// const { expect } = require("chai");
// const { model } = require("mongoose");
// const CartModel = require("../../../src/models/cartModel");

// describe("CartModel", () => {
//   it("should create a valid Cart model instance", () => {
//     const validCartData = {
//       account_id: "65b284df758cd8145ada72fd",
//       products: [{ _id: "65b9267e5a3a2fb776c70d19", quantity: 2 }],
//       count_product: 1,
//       total: 20,
//       status: 1,
//     };

//     const cartInstance = new CartModel(validCartData);

//     expect(cartInstance.account_id).to.equal(validCartData.account_id);
//     expect(cartInstance.products).to.deep.equal(validCartData.products);
//     expect(cartInstance.count_product).to.equal(validCartData.count_product);
//     expect(cartInstance.total).to.equal(validCartData.total);
//     expect(cartInstance.status).to.equal(validCartData.status);
//   });

//   it("should validate required fields", async () => {
//     const invalidCartData = {};

//     const cartInstance = new CartModel(invalidCartData);

//     try {
//       await cartInstance.validate();
//     } catch (error) {
//       expect(error.errors.account_id).to.exist;
//     }
//   });
// });
