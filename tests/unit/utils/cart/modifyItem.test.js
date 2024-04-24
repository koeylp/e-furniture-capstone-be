const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const CartController = require("../../../../src/controllers/cartController");
const CartRepository = require("../../../../src/models/repositories/cartRepository");
const CartService = require("../../../../src/services/cartService");
const { OK } = require("../../../../src/utils/successHandler");

chai.use(sinonChai);
const { expect } = chai;
const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res.json);
  return res;
};

describe("modifyItemCartService", () => {
  const account_id = "65b284df758cd8145ada72fd";
  const product = {
    _id: "65b9267e5a3a2fb776c70d19",
    quantity: 1,
    variation: "default",
  };
  const cart = {
    account_id: "65b284df758cd8145ada72fd",
    products: [{ _id: "65b9267e5a3a2fb776c70d19", quantity: 2 }],
    count_product: 1,
    total: 20,
    status: 1,
  };
  const cartResponse = {
    account_id: "65b284df758cd8145ada72fd",
    products: [{ _id: "65b9267e5a3a2fb776c70d19", quantity: 2 }],
    count_product: 1,
    total: 10,
    status: 1,
  };
  const cartProductEmptyResponse = {
    account_id: "65b284df758cd8145ada72fd",
    products: [],
    count_product: 0,
    total: 10,
    status: 1,
  };
  const newQuantity = 10;

  var mockCartService = sinon.stub(CartService, "updateItemQuantity");
  mockCartService.withArgs(account_id, product, newQuantity).returns("carts");
  mockCartService
    .withArgs(account_id, product, 0)
    .returns(cartProductEmptyResponse);

  it("should update item quantity", async () => {
    const mockCartRepository = sinon
      .stub(CartRepository, "save")
      .withArgs(cart)
      .returns(cartResponse);

    expect(
      CartService.updateItemQuantity(account_id, product, newQuantity)
    ).to.be.equal("carts");

    expect(CartService.updateItemQuantity(account_id, product, 0)).to.be.equal(
      cartProductEmptyResponse
    );

    expect(CartRepository.save(cart)).to.be.equal(cartResponse);
  });

  it("should call CartService.updateItemQuantity and send OK response", async () => {
    const req = mockReq({ product, newQuantity });
    const res = mockRes();
    req.payload = {
      account_id: account_id,
    };

    await CartController.updateItemQuantity(req, res);
    expect(mockCartService).to.have.been.calledWith(
      account_id,
      product,
      newQuantity
    );
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Updated quantity",
        metaData: "carts",
      })
    );
    CartService.updateItemQuantity.restore();
  });
  it("should call CartService.increaseItemQuantity and send OK response", async () => {
    const account_id = "123";
    const product = { _id: "test_id", quantity: 1, variation: "default" };
    const req = mockReq(product);
    const res = mockRes();
    req.payload = {
      account_id: "123",
    };

    const mockCartService = sinon
      .stub(CartService, "increaseItemQuantity")
      .resolves("carts");
    await CartController.increaseItemQuantity(req, res);
    expect(mockCartService).to.have.been.calledOnceWith(account_id, product);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Updated quantity",
        metaData: "carts",
      })
    );
    CartService.increaseItemQuantity.restore();
  });
  it("should call CartService.decreaseItemQuantity and send OK response", async () => {
    const account_id = "123";
    const product = { _id: "test_id", quantity: 1, variation: "default" };
    const req = mockReq(product);
    const res = mockRes();
    req.payload = {
      account_id: "123",
    };

    const mockCartService = sinon
      .stub(CartService, "decreaseItemQuantity")
      .resolves("carts");
    await CartController.decreaseItemQuantity(req, res);
    expect(mockCartService).to.have.been.calledOnceWith(account_id, product);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Updated quantity",
        metaData: "carts",
      })
    );
    CartService.decreaseItemQuantity.restore();
  });
  it("should throw BadRequestError if data is missing with udate item", async () => {
    const req = mockReq({}); // No username or password
    const res = mockRes();

    try {
      await CartController.updateItemInCart(req, res);
    } catch (error) {
      expect(error.message).to.be.Throw;
    }
  });
  it("should throw BadRequestError if data is missing with increase ", async () => {
    const req = mockReq({}); // No username or password
    const res = mockRes();

    try {
      await CartController.increaseItemQuantity(req, res);
    } catch (error) {
      expect(error.message).to.be.Throw;
    }
  });
  it("should throw BadRequestError if data is missing with decrease", async () => {
    const req = mockReq({}); // No username or password
    const res = mockRes();

    try {
      await CartController.decreaseItemQuantity(req, res);
    } catch (error) {
      expect(error.message).to.be.Throw;
    }
  });
});
