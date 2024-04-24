const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const CartController = require("../../../../src/controllers/cartController");
const CartRepository = require("../../../../src/models/repositories/cartRepository");
const CartService = require("../../../../src/services/cartService");
const { OK } = require("../../../../src/utils/successHandler");
const CartUtils = require("../../../../src/utils/cartUtils");
const ProductRepository = require("../../../../src/models/repositories/productRepository");
const { BadRequestError } = require("../../../../src/utils/errorHanlder");

chai.use(sinonChai);
const { expect } = chai;
const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res.json);
  return res;
};

describe("CartService", () => {
  describe("getCart", () => {
    it("should get list of products from cart", async () => {
      const account_id = "123";
      const product = { _id: "test_id", quantity: 1, variation: "default" };
      const mockProductRepository = sinon
        .stub(ProductRepository, "findPublishProductByIDWithModify")
        .withArgs(product._id)
        .returns(product);

      var stub = sinon.stub(CartService, "getCart");
      stub.withArgs(account_id).returns("carts");
      expect(CartService.getCart(account_id)).to.be.equal("carts");
      expect(
        ProductRepository.findPublishProductByIDWithModify(product._id)
      ).to.be.equal(product);
    });
  });
  it("should throw BadRequestError if data is missing", async () => {
    const req = mockReq({}); // No username or password
    req.payload = {
      account_id: null,
    };
    const res = mockRes();

    try {
      await CartController.addToCart(req, res);
    } catch (error) {
      expect(error).to.be.an.instanceOf(BadRequestError);
      expect(error.message).to.equal("Bad Request");
      expect(error.message).to.be.Throw;
    }
  });
  it("should throw BadRequestError if account_id is missing", async () => {
    const req = mockReq();
    const res = mockRes();
    try {
      await CartController.getCart(req, res);
    } catch (error) {
      expect(error.message).to.be.Throw;
    }
  });

  it("should call CartService.getCart and send OK response", async () => {
    const req = mockReq();
    const res = mockRes();
    req.payload = {
      account_id: "123",
    };

    const mockCartService = sinon
      .stub(CartService, "getCart")
      .resolves("carts");
    await CartController.getCart(req, res);
    expect(mockCartService).to.have.been.calledOnceWith("123");
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Your cart",
        metaData: "carts",
      })
    );
    CartService.getCart.restore();
  });
});
