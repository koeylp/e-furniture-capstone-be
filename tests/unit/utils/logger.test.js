const chai = require("chai");
const sinon = require("sinon");
const logger = require("../../../src/utils/logger");

const { expect } = chai;

describe("Logger Function", () => {
  let consoleLogStub;

  beforeEach(() => {
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(() => {
    consoleLogStub.restore();
  });

  it("should log a message with [INFO] prefix", () => {
    const message = "Test message";
    logger(message);
    
    expect(consoleLogStub.calledOnce).to.be.true;
    expect(consoleLogStub.firstCall.args[0]).to.equal(`[INFO] ${message}`);
  });
});
