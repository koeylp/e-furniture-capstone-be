// const { expect } = require("chai");
// const sinon = require("sinon");
// const CartRepository = require("../../../src/models/repositories/cartRepository");
// const ProductRepository = require("../../../src/models/repositories/productRepository");
// const _Cart = require("../../../src/models/cartModel");

// describe("CartRepository", () => {
//   describe("createCart", () => {
//     it("should create a new cart", async () => {
//       const account_id = "someAccountId";
//       const createStub = sinon
//         .stub(_Cart, "create")
//         .resolves({ _id: "someCartId", status: 1 });

//       const result = await CartRepository.createCart(account_id);

//       expect(createStub.calledOnceWithExactly({ account_id, status: 1 })).to.be
//         .true;
//       expect(result).to.deep.equal({ _id: "someCartId", status: 1 });

//       createStub.restore();
//     });

//     it("should handle internal server error during cart creation", async () => {
//       const account_id = "someAccountId";
//       const createStub = sinon
//         .stub(_Cart, "create")
//         .rejects(new Error("Mocked error"));

//       try {
//         await CartRepository.createCart(account_id);
//         expect.fail("Expected an InternalServerError, but none was thrown");
//       } catch (error) {
//         expect(error.message).to.equal("Mocked error");
//       }

//       createStub.restore();
//     });
//   });

//   describe("findByAccountId", () => {
//     it("should find a cart by account ID", async () => {
//       const query = { account_id: "someAccountId" };
//       const findOneStub = sinon
//         .stub(_Cart, "findOne")
//         .resolves({ _id: "someCartId" });

//       const result = await CartRepository.findByAccountId(query);

//       expect(findOneStub.calledOnceWithExactly(query)).to.be.true;
//       expect(result).to.deep.equal({ _id: "someCartId" });

//       findOneStub.restore();
//     });

//     it("should handle errors during cart retrieval", async () => {
//       const query = { account_id: "someAccountId" };
//       const findOneStub = sinon
//         .stub(_Cart, "findOne")
//         .rejects(new Error("Mocked error"));

//       try {
//         await CartRepository.findByAccountId(query);
//         expect.fail("Expected an error, but none was thrown");
//       } catch (error) {
//         expect(error.message).to.equal("Mocked error");
//       }

//       findOneStub.restore();
//     });
//   });
// });
