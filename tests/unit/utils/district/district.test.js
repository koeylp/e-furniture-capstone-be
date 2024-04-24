const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const DistrictService = require("../../../../src/services/districtService");
const DistrictRepository = require("../../../../src/models/repositories/districtRepository");
const { BadRequestError } = require("../../../../src/utils/errorHanlder");

chai.use(sinonChai);

const { expect } = chai;

const mockDistrictRepository = {};

describe("DistrictService", () => {
  beforeEach(() => {
    sinon.stub(DistrictRepository, "createDistrict").resolves({});
    sinon.stub(DistrictRepository, "findDistrictById").resolves({});
    sinon.stub(DistrictRepository, "getDistricts").resolves([]);
    sinon.stub(DistrictRepository, "update").resolves({});
    sinon.stub(DistrictRepository, "save").resolves({});
    sinon.stub(DistrictRepository, "findDistrictByName").resolves({});
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createDistrict", () => {
    it("should create a district", async () => {
      const payload = { name: "Some District" };
      const district = await DistrictService.createDistrict(payload);
      expect(district).to.be.an("object");
      expect(DistrictRepository.createDistrict).to.have.been.calledWith(
        payload
      );
    });
  });

  describe("findDistrictById", () => {
    it("should find a district by id", async () => {
      const district_id = "123";
      const district = await DistrictService.findDistrictById(district_id);
      expect(district).to.be.an("object");
      expect(DistrictRepository.findDistrictById).to.have.been.calledWith(
        district_id
      );
    });
  });

  describe("getAllDistricts", () => {
    it("should get all districts", async () => {
      const districts = await DistrictService.getAllDistricts();
      expect(districts).to.be.an("array");
      expect(DistrictRepository.getDistricts).to.have.been.calledOnce;
    });
  });

  describe("updateDistrict", () => {
    it("should update a district", async () => {
      const district_id = "123";
      const payload = { name: "Updated District Name" };
      const district = await DistrictService.updateDistrict(
        district_id,
        payload
      );
      expect(district).to.be.an("object");
      expect(DistrictRepository.update).to.have.been.calledWith(
        district_id,
        payload
      );
    });

    it("should throw error for invalid totalOrder", async () => {
      const district_id = "123";
      const payload = { totalOrder: -1 };
      try {
        await DistrictService.updateDistrict(district_id, payload);
      } catch (error) {
        expect(error).to.be.an.instanceof(BadRequestError);
        expect(error.message).to.equal("Total Order cannot less than 0!");
      }
    });
  });

  describe("increaseOrderOfDistrict", () => {
    it("should increase order of a district", async () => {
      const district_id = "123";
      const district = await DistrictService.increaseOrderOfDistrict(
        district_id
      );
      expect(district).to.be.an("object");
      expect(DistrictRepository.findDistrictById).to.have.been.calledWith(
        district_id
      );
      expect(DistrictRepository.save).to.have.been.calledOnce;
    });

    it("should throw error for non-numeric number", async () => {
      const district_id = "123";
      const number = "invalid";
      try {
        await DistrictService.increaseOrderOfDistrict(district_id, number);
      } catch (error) {
        expect(error).to.be.an.instanceof(BadRequestError);
        expect(error.message).to.equal("Cannot increase with invalid number!");
      }
    });
  });
});
