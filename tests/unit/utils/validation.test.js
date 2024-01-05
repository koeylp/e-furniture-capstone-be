const { describe, it } = require("mocha");
const { expect } = require("chai");
const {
  validateEmail,
  validateUsername,
  validatePassword,
  validatePhoneNumber,
} = require("../../../src/utils/validation");

describe("Validation Function", () => {
  // email validation tests
  describe("validateEmail", () => {
    it("should validate a valid email address", () => {
      const result = validateEmail("furniture@gmail.com");
      expect(result.error).to.be.undefined;
    });

    it("should return an error for an invalid email address", () => {
      const result = validateEmail("invalid-email");
      expect(result.error).to.exist;
    });
  });

  // username validation tests
  describe("validateUsername", () => {
    it("should validate a valid username", () => {
      const result = validateUsername("validUsername123");
      expect(result.error).to.be.undefined;
    });

    it("should return an error for an invalid username", () => {
      const result = validateUsername("invalid username");
      expect(result.error).to.exist;
    });
  });

  // password validation tests
  describe("validatePassword", () => {
    it("should validate a valid password", () => {
      const result = validatePassword("StrongPass123");
      expect(result.error).to.be.undefined;
    });

    it("should return an error for a weak password", () => {
      const result = validatePassword("weakpass");
      expect(result.error).to.exist;
    });
  });

  // phone number validation tests
  describe("validatePhoneNumber", () => {
    it("should return no error for a valid Vietnam phone number with 84 and [3,5,7,8,9]", () => {
      const validPhoneNumber = "84323456789";
      const result = validatePhoneNumber(validPhoneNumber);

      expect(result.error).to.be.undefined;
    });

    it("should return no error for a valid Vietnam phone number with 0 and [3,5,7,8,9]", () => {
      const validPhoneNumber = "0823456789"; 
      const result = validatePhoneNumber(validPhoneNumber);

      expect(result.error).to.be.undefined;
    });

    it("should return an error for an invalid Vietnam phone number", () => {
      const invalidPhoneNumber = "12345"; 
      const result = validatePhoneNumber(invalidPhoneNumber);

      expect(result.error).to.be.exist;
      expect(result.error.details[0].message).to.equal(
        "Please enter a valid Vietnam phone number."
      );
    });
  });
});
