const { describe, it } = require("mocha");
const { expect } = require("chai");
const {
  formatDate,
  capitalizeFirstLetter,
  vndFormatCurrency,
} = require("../../../src/utils/format");

describe("formatDate", () => {
  it("should format the date using the default format", () => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const expectedFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

    expect(formattedDate).to.match(expectedFormat);
  });

  it("should format the date using a custom format", () => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate, "YYYY-MM-DD");
    const expectedFormat = /^\d{4}-\d{2}-\d{2}$/;

    expect(formattedDate).to.match(expectedFormat);
  });
});

describe("capitalizeFirstLetter", () => {
  it("should capitalize the first letter of a string", () => {
    const result = capitalizeFirstLetter("merry xmas");
    expect(result).to.equal("Merry xmas");
  });

  it("should handle strings with leading and trailing whitespaces", () => {
    const result = capitalizeFirstLetter("   merry xmas   ");
    expect(result).to.equal("Merry xmas");
  });

  it("should handle empty string", () => {
    const result = capitalizeFirstLetter("");
    expect(result).to.equal("");
  });

  it("should handle null or undefined input", () => {
    const resultNull = capitalizeFirstLetter(null);
    const resultUndefined = capitalizeFirstLetter(undefined);

    expect(resultNull).to.equal("");
    expect(resultUndefined).to.equal("");
  });
});

describe("vndFormatCurrency", () => {
  it('should format positive amount correctly', () => {
    const result = vndFormatCurrency(1234567);
    expect(result).to.equal('1.234.567 ₫');
  });

  it('should format negative amount correctly', () => {
    const result = vndFormatCurrency(-9876543);
    expect(result).to.equal('-9.876.543 ₫');
  });

  it('should handle zero amount correctly', () => {
    const result = vndFormatCurrency(0);
    expect(result).to.equal('0 ₫');
  });

  it('should handle null input', () => {
    const result = vndFormatCurrency(null);
    expect(result).to.equal('0 ₫');
  });

  it('should handle undefined input', () => {
    const result = vndFormatCurrency(undefined);
    expect(result).to.equal('0 ₫');
  });
});
