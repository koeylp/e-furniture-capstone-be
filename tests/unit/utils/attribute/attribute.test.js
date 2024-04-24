const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const AttributeController = require("../../../../src/controllers/attributeController");
const AttributeService = require("../../../../src/services/attributeService");
const { BadRequestError } = require("../../../../src/utils/errorHanlder");
const { OK } = require("../../../../src/utils/successHandler");
const AttributeRepository = require("../../../../src/models/repositories/attributeRepository");

chai.use(sinonChai);

const { expect } = chai;
const mockReq = (body) => ({ body });
const mockRes = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res.json);
  return res;
};

describe("AttributeService", () => {
  const attribute_id = "65b284df758cd8145ada72fd";
  const payload = {
    name: "Width",
    type: "string",
    status: 1,
  };
  const attribute = {
    attribute_id: "65b284df758cd8145ada72fd",
    name: "Width",
    type: "string",
    status: 1,
  };
  const req = mockReq(payload);
  const res = mockRes();
  req.params = {
    attribute_id: attribute_id,
  };
  var mockCreateAttributeService = sinon.stub(
    AttributeService,
    "createAttribute"
  );
  mockCreateAttributeService.withArgs(payload).returns(attribute);

  var mockGetAttributes = sinon.stub(AttributeService, "getAttributes");
  mockGetAttributes.withArgs().returns(attribute);

  var mockFindAttribute = sinon.stub(AttributeService, "findAttribute");
  mockFindAttribute.withArgs(attribute_id).returns(attribute);

  var mockEnableAttribute = sinon.stub(AttributeService, "enableAttribute");
  mockEnableAttribute.withArgs(attribute_id).returns(attribute);

  var mockDisableAttribute = sinon.stub(AttributeService, "disableAttribute");
  mockDisableAttribute.withArgs(attribute_id).returns(attribute);

  it("should create Address", async () => {
    const mockCartRepository = sinon
      .stub(AttributeRepository, "createAttribute")
      .withArgs(payload)
      .returns(attribute);
    expect(AttributeService.createAttribute(payload)).to.be.equal(attribute);
    expect(AttributeRepository.createAttribute(payload)).to.be.equal(attribute);
  });
  it("should get Attributes", async () => {
    expect(AttributeService.getAttributes()).to.be.equal(attribute);
  });
  it("should find Attributes", async () => {
    expect(AttributeService.findAttribute(attribute_id)).to.be.equal(attribute);
  });
  it("should Enable Attributes", async () => {
    expect(AttributeService.enableAttribute(attribute_id)).to.be.equal(
      attribute
    );
  });
  it("should Disable Attributes", async () => {
    expect(AttributeService.disableAttribute(attribute_id)).to.be.equal(
      attribute
    );
  });

  it("should call AttributeService create and send OK response", async () => {
    const req = mockReq();
    const res = mockRes(payload);

    await AttributeController.createAttribute(req, res);
    expect(mockCreateAttributeService).to.have.been.calledWith(payload);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "Create Attribute Successfully!",
        metaData: [],
      })
    );
  });

  it("should call AttributeService getAllAttribute and send OK response", async () => {
    const req = mockReq();
    const res = mockRes();

    await AttributeController.getAllAttribute(req, res);
    var mockGetAttributeController = sinon
      .stub(AttributeController, "getAllAttribute")
      .resolves(attribute);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "List Of Attribute!",
        metaData: attribute,
      })
    );
  });

  it("should call AttributeService findAttribute and send OK response", async () => {
    const req = mockReq();
    const res = mockRes();

    req.params = {
      attribute_id: attribute_id,
    };

    await AttributeController.findAttribute(req, res);
    var stub = sinon
      .stub(AttributeController, "findAttribute")
      .resolves(attribute);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(
      new OK({
        message: "List Of Attribute!",
        metaData: attribute,
      })
    );
  });
});
