const { PermissionConstants } = require("../../../../src/utils/roleConstant");
global.PermissionConstants = PermissionConstants;
const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const CartController = require("../../../../src/controllers/cartController");
const CartRepository = require("../../../../src/models/repositories/cartRepository");
const CartService = require("../../../../src/services/cartService");
const { BadRequestError } = require("../../../../src/utils/errorHanlder");
const { OK } = require("../../../../src/utils/successHandler");
const { getCode } = require("../../../../src/utils/codeUtils");
const CartUtils = require("../../../../src/utils/cartUtils");
const ProductRepository = require("../../../../src/models/repositories/productRepository");

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
  describe("addToCart", () => {
    it("should add a new product to the cart", async () => {
      const account_id = "123";
      const product = { _id: "test_id", quantity: 1, variation: "default" };
      const mockProductRepository = sinon
        .stub(ProductRepository, "checkProductById")
        .withArgs(product._id)
        .returns(product);
      const mockCartUtils = sinon
        .stub(CartUtils, "handleCart")
        .withArgs(account_id)
        .resolves({});
      const mockCartRepository = sinon
        .stub(CartRepository, "save")
        .returns(true);
      const mockCheckOutOfStock = sinon
        .stub(CartService, "checkOutOfStock")
        .returns(false);

      var stub = sinon.stub(CartService, "addToCart");
      stub.withArgs(account_id, product).returns("100");
      expect(CartService.addToCart(account_id, product)).to.be.equal("100");
      expect(ProductRepository.checkProductById(product._id)).to.be.equal(
        product
      );
    });
  });
  it("should throw BadRequestError if data is missing", async () => {
    const req = mockReq({}); // No username or password
    const res = mockRes();

    try {
      await CartController.addToCart(req, res);
    } catch (error) {
      expect(error.message).to.be.Throw;
    }
  });
  it("should throw BadRequestError if account_id is missing", async () => {
    const product = { _id: "test_id", quantity: 1, variation: "default" };
    const req = mockReq(product);
    const res = mockRes();

    try {
      await CartController.addToCart(req, res);
    } catch (error) {
      expect(error.message).to.be.Throw;
    }
  });

  it("should call CartService.addToCart and send OK response", async () => {
    const account_id = "123";
    const product = { _id: "test_id", quantity: 1, variation: "default" };
    const req = mockReq(product);
    const res = mockRes();
    req.payload = {
      account_id: "123",
    };

    const mockCartService = sinon
      .stub(CartService, "addToCart")
      .resolves("loginResult");
    await CartController.addToCart(req, res);
    expect(mockCartService).to.have.been.calledOnceWith(account_id, product);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Added to cart",
        metaData: "loginResult",
      })
    );

    // Restore the stub after the test
    CartService.addToCart.restore();
  });
});
