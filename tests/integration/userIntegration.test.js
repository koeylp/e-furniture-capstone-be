// const { expect } = require("chai");
// const request = require("supertest");
// const app = require("../../config/routeConfig");
// const userModel = require("../../src/models/userModel");
// const Sinon = require("sinon");

// describe("User Integration Tests", () => {
//   describe("GET /users/:userId", () => {
//     it("should return a user by ID", async () => {
//       // Assuming there's a user with ID '123' in the test database
//       const testUser = { _id: "123", username: "testUser" };
//       const userStub = Sinon.stub(userModel, "findById").resolves(testUser);

//       const response = await request(app).get("/users/123");

//       // Verify that the response is as expected
//       expect(response.status).to.equal(200);
//       expect(response.body).to.deep.equal(testUser);

//       // Restore the original function after the test
//       userStub.restore();
//     });
//   });

// });
