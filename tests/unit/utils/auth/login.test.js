const { PermissionConstants } = require("../../../../src/utils/roleConstant");
global.PermissionConstants = PermissionConstants;
const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const AuthController = require("../../../../src/controllers/authController");
const AuthService = require("../../../../src/services/authService");
const { BadRequestError } = require("../../../../src/utils/errorHanlder");
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

describe("AuthController", () => {
  describe("login", () => {
    it("should throw BadRequestError if username or password is missing", async () => {
      const req = mockReq({}); // No username or password
      const res = mockRes();

      try {
        await AuthController.login(req, res);
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Username or password is missing");
      }
    });

    it("should call AuthService.login and send OK response", async () => {
      const req = mockReq({ username: "testuser", password: "testpassword" });
      const res = mockRes();

      sinon.stub(AuthService, "login").resolves("loginResult");

      await AuthController.login(req, res);

      expect(AuthService.login).to.have.been.calledWith(
        "testuser",
        "testpassword"
      );
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(
        new OK({
          message: "Login To Efurniture Successfully!",
          metaData: "loginResult",
        })
      );

      // Restore the stub after the test
      AuthService.login.restore();
    });
  });
  describe("loginEfurniture", () => {
    it("should throw BadRequestError if username or password is missing", async () => {
      const req = mockReq({}); // No username or password
      const res = mockRes();

      try {
        await AuthController.loginEfurniture(req, res);
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Username or password is missing");
      }
    });

    it("should call AuthService.loginEfurniture and send OK response", async () => {
      const req = mockReq({ username: "testuser", password: "testpassword" });
      const res = mockRes();

      sinon.stub(AuthService, "loginEfurniture").resolves("loginResult");

      await AuthController.loginEfurniture(req, res);

      expect(AuthService.loginEfurniture).to.have.been.calledWith(
        "testuser",
        "testpassword"
      );
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(
        new OK({
          message: "Success",
          metaData: "loginResult",
        })
      );

      // Restore the stub after the test
      AuthService.loginEfurniture.restore();
    });
  });
  describe("loginDelivery", () => {
    it("should throw BadRequestError if username or password is missing", async () => {
      const req = mockReq({}); // No username or password
      const res = mockRes();

      try {
        await AuthController.loginDelivery(req, res);
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Username or password is missing");
      }
    });

    it("should call AuthService.loginDelivery and send OK response", async () => {
      const req = mockReq({ username: "testuser", password: "testpassword" });
      const res = mockRes();

      sinon.stub(AuthService, "loginDelivery").resolves("loginResult");

      await AuthController.loginDelivery(req, res);

      expect(AuthService.loginDelivery).to.have.been.calledWith(
        "testuser",
        "testpassword"
      );
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(
        new OK({
          message: "Success",
          metaData: "loginResult",
        })
      );

      // Restore the stub after the test
      AuthService.loginDelivery.restore();
    });
  });
  describe("logout", () => {
    it("should throw BadRequestError if account_id missing", async () => {
      const req = mockReq({});
      req.payload = {};
      const res = mockRes();

      try {
        await AuthController.logout(req, res);
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Bad Request");
      }
    });
    it("should call AuthService.logout and send OK response", async () => {
      const req = mockReq({ account_id: "123" });
      req.payload = {
        account_id: "123",
      };
      const res = mockRes();

      sinon.stub(AuthService, "logout").resolves("logoutResult");

      await AuthController.logout(req, res);

      expect(AuthService.logout).to.have.been.calledWith("123");
      expect(res.status).to.have.been.calledWith(200);
      expect(res.json).to.have.been.calledWith(
        new OK({ message: "Success", metaData: "logoutResult" })
      );
    });
  });
});
