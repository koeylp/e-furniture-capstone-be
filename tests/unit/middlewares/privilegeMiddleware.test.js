// const { describe, it } = require("mocha");
// const { expect } = require("chai");
// const sinon = require("sinon");
// const jwt = require("jsonwebtoken");

// const {
//   customerProtection,
//   adminProtection,
// } = require("../../../src/middlewares/privilegeMiddleware");

// describe("Auth Middlewares", () => {
//   describe("customerProtection", () => {
//     it('should call next() if user has "customer" privilege', () => {
//       const req = { cookies: { token: "validToken" } };
//       const res = {};
//       const next = sinon.spy();

//       // Mock jwt.verify to return a user with "customer" privilege
//       sinon.stub(jwt, "verify").returns({ customer: true });

//       customerProtection(req, res, next);

//       expect(next.calledOnce).to.be.true;
//     });

//     // it('should return 403 if user does not have "customer" privilege', () => {
//     //   const req = { cookies: { token: "validToken" } };
//     //   const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
//     //   const next = sinon.spy();

//     //   // Stub jwt.verify to return a user without "customer" privilege
//     //   verifyStub.returns({ customer: false });

//     //   customerProtection(req, res, next);

//     //   expect(res.status.calledWith(403)).to.be.true;
//     //   expect(res.json.calledOnce).to.be.true;
//     // });
//   });

//   //   describe('adminProtection', () => {

//   //   });
// });
