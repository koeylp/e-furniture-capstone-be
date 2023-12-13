const { describe, it } = require("mocha");
const { expect } = require("chai");
const {
  validateEmail,
  validateUsername,
  validatePassword,
} = require("../../src/utils/validation");

describe("Validation Function", () => {
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
});
