const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const AddressController = require("../../../../src/controllers/addressController");
const addressService = require("../../../../src/services/addressService");
const { BadRequestError } = require("../../../../src/utils/errorHanlder");
const { OK } = require("../../../../src/utils/successHandler");
const RoleFactory = require("../../../../src/services/roleFactory/role");
const AccountRepository = require("../../../../src/models/repositories/accountRepository");
const AddressService = require("../../../../src/services/addressService");
const AddressRepository = require("../../../../src/models/repositories/addressRepository");

RoleFactory.registerRoles();

chai.use(sinonChai);

const { expect } = chai;
const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res.json);
  return res;
};

describe("addressService", () => {
  const req = mockReq();
  const res = mockRes();
  req.payload = {
    account_id: "65b284df758cd8145ada72fd",
  };
  const account_id = "65b284df758cd8145ada72fd";
  const address_id = "65b284df758cd8145ada72fd";
  const payload = {
    phone: "0344350704",
    province: "Bình Dương My Love",
    district: "Dầu Tiếng",
    ward: "Thị Trấn Dầu Tiếng Kp4B",
    address: "Đường Hùng Vương, kp4B",
  };
  const address = {
    account_id: "65b284df758cd8145ada72fd",
    phone: "0344350704",
    province: "Bình Dương My Love",
    district: "Dầu Tiếng",
    ward: "Thị Trấn Dầu Tiếng Kp4B",
    address: "Đường Hùng Vương, kp4B",
  };

  var mockCreateAddressService = sinon.stub(AddressService, "createAddress");
  mockCreateAddressService.withArgs(account_id, payload).returns(address);

  var mockGetAddressByUser = sinon.stub(AddressService, "getAddressByUser");
  mockGetAddressByUser.withArgs(account_id).returns(address);

  var mockGetAddressDefault = sinon.stub(AddressService, "getAddressDefault");
  mockGetAddressDefault.withArgs(account_id).returns(address);

  var mockSetAddressDefault = sinon.stub(AddressService, "setAddressDefault");
  mockSetAddressDefault.withArgs(account_id, address_id).returns(address);

  it("should create Address", async () => {
    const mockCartRepository = sinon
      .stub(AccountRepository, "findAccountById")
      .withArgs(account_id)
      .returns(address);

    expect(AddressService.createAddress(account_id, payload)).to.be.equal(
      address
    );
    expect(AccountRepository.findAccountById(account_id)).to.be.equal(address);
  });
  it("should get Address By User", async () => {
    const mockCartRepository = sinon
      .stub(AddressRepository, "getAddressByAccountId")
      .withArgs(account_id)
      .returns(address);

    expect(AddressRepository.getAddressByAccountId(account_id)).to.be.equal(
      address
    );
  });
  it("should get Address Default", async () => {
    const mockCartRepository = sinon
      .stub(AddressRepository, "getAccountDefaultAddress")
      .withArgs(account_id)
      .returns(address);

    expect(AddressRepository.getAccountDefaultAddress(account_id)).to.be.equal(
      address
    );
  });
  it("should set Address Default", async () => {
    const mockCartRepository = sinon
      .stub(AddressRepository, "setAddressNotDefault")
      .withArgs(account_id)
      .returns(address);
    const mockCartRepositoryDefault = sinon
      .stub(AddressRepository, "setAddressDefault")
      .withArgs(account_id)
      .returns(address);

    expect(AddressRepository.setAddressNotDefault(account_id)).to.be.equal(
      address
    );
    expect(AddressRepository.setAddressDefault(account_id)).to.be.equal(
      address
    );
  });
  it("should edit Address", async () => {
    const mockCartRepository = sinon
      .stub(AddressRepository, "editAddress")
      .withArgs(account_id, payload)
      .returns(address);
    expect(AddressRepository.editAddress(account_id, payload)).to.be.equal(
      address
    );
  });

  it("should call CartService.getAddressByUser and send OK response", async () => {
    const req = mockReq();
    const res = mockRes();
    req.payload = {
      account_id: account_id,
    };

    await AddressController.getAddressByUser(req, res);
    expect(mockGetAddressByUser).to.have.been.calledWith(account_id);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "List Address By User!",
        metaData: address,
      })
    );
  });
  it("should call CartService.getAddressDefault and send OK response", async () => {
    const req = mockReq();
    const res = mockRes();
    req.payload = {
      account_id: account_id,
    };

    await AddressController.getAddressDefault(req, res);
    expect(mockGetAddressDefault).to.have.been.calledWith(account_id);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Default Address By User!",
        metaData: address,
      })
    );
  });
  it("should call CartService.setAddressDefault and send OK response", async () => {
    const req = mockReq();
    const res = mockRes();
    req.payload = {
      account_id: account_id,
    };
    req.params = {
      address_id: address_id,
    };

    await AddressController.setAddressDefault(req, res);
    expect(mockSetAddressDefault).to.have.been.calledWith(
      account_id,
      address_id
    );
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Set Default Address Successfully!",
        metaData: address,
      })
    );
  });
});
