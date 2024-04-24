const sinon = require("sinon");
const { expect } = require("chai");
const TransactionRepository = require("../../../src/models/repositories/transactionRepository");
const TransactionService = require("../../../src/services/transactionService");
const AccountRepository = require("../../../src/models/repositories/accountRepository");

describe("TransactionService", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should create a transaction", async () => {
    const payload = {
      sender: { name: "Sender Name", email: "sender@example.com" },
      receiver: { name: "Receiver Name", email: "receiver@example.com" },
      amount: 100,
      description: "Test transaction",
      type: "Income",
    };

    const expectedTransaction = { _id: "mocked_id", ...payload };
    sinon.stub(TransactionRepository, "create").resolves(expectedTransaction);

    const createdTransaction = await TransactionService.create(payload);

    expect(createdTransaction).to.deep.equal(expectedTransaction);
  });

  it("should create a paid transaction", async () => {
    const account = {
      _id: "account_id",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
    };

    const orderCode = "ORDER123";
    const transactionPayload = { amount: 100 };
    const expectedTransaction = {
      _id: "mocked_id",
      sender: { name: "John Doe", email: "john.doe@example.com" },
      receiver: { name: "eFurniture", email: "eFurniture@gmail.com" },
      amount: 100,
      description: `Paid For Order Code:${orderCode}`,
      type: "Income",
    };

    sinon.stub(AccountRepository, "findAccountById").resolves(account);
    sinon.stub(TransactionRepository, "create").resolves(expectedTransaction);

    const createdTransaction = await TransactionService.createPaidTransaction(
      account._id,
      transactionPayload,
      orderCode
    );

    expect(createdTransaction).to.deep.equal(expectedTransaction);
  });

  it("should create a refund transaction", async () => {
    const report = {
      requester: { name: "Requester Name", email: "requester@example.com" },
      amount: 50,
      note: "Refund for damaged item",
    };

    const expectedTransaction = {
      _id: "mocked_id",
      receiver: { name: "Requester Name", email: "requester@example.com" },
      sender: { name: "eFurniture", email: "eFurniture@gmail.com" },
      amount: 50,
      description: "Refund for damaged item",
      type: "Outcome",
    };

    sinon.stub(TransactionRepository, "create").resolves(expectedTransaction);

    const createdTransaction = await TransactionService.createRefundTransaction(
      report
    );

    expect(createdTransaction).to.deep.equal(expectedTransaction);
  });

  it("should get transactions by account", async () => {
    const account_id = "6619562ec49d81b1879f158a";
    const transactions = [
      { _id: "6619562ec49d81b1879f158e", amount: 100 },
      { _id: "6619562ec49d81b1879f158o", amount: 200 },
    ];

    sinon.stub(TransactionRepository, "getTransaction").resolves({
      total: transactions.length,
      data: transactions,
    });

    const fetchedTransactions =
      await TransactionService.getTransactionsByAccount(account_id);

    expect(fetchedTransactions).to.deep.equal({
      total: transactions.length,
      data: transactions,
    });
  });

  it("should get all transactions", async () => {
    const transactions = [
      { _id: "6619562ec49d81b1879f158e", amount: 100 },
      { _id: "6619562ec49d81b1879f158f", amount: 200 },
    ];

    sinon.stub(TransactionRepository, "getTransaction").resolves({
      total: transactions.length,
      data: transactions,
    });

    const fetchedTransactions = await TransactionService.getTransactions();

    expect(fetchedTransactions).to.deep.equal({
      total: transactions.length,
      data: transactions,
    });
  });

  it("should find a transaction by ID", async () => {
    const transaction_id = "6619562ec49d81b1879f158e";
    const transaction = { _id: "6619562ec49d81b1879f158a", amount: 100 };

    sinon.stub(TransactionRepository, "findTransaction").resolves(transaction);

    const foundTransaction = await TransactionService.findTransaction(
      transaction_id
    );

    expect(foundTransaction).to.deep.equal(transaction);
  });

  it("should throw an error when creating a transaction with invalid payload", async () => {
    const invalidPayload = {};
    try {
      await TransactionService.create(invalidPayload);
      expect.fail("Expected an error but none was thrown");
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("should throw an error when creating a paid transaction with invalid account ID", async () => {
    const invalidAccountId = "invalid_id";
    const transactionPayload = { amount: 100 };
    const orderCode = "ORDER123";

    sinon.stub(AccountRepository, "findAccountById").resolves(null);

    try {
      await TransactionService.createPaidTransaction(
        invalidAccountId,
        transactionPayload,
        orderCode
      );
      expect.fail("Expected an error but none was thrown");
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("should throw an error when creating a refund transaction with invalid report", async () => {
    const invalidReport = {};
    try {
      await TransactionService.createRefundTransaction(invalidReport);
      expect.fail("Expected an error but none was thrown");
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });

  it("should throw an error when finding a transaction with invalid transaction ID", async () => {
    const invalidTransactionId = "invalid_id";

    sinon.stub(TransactionRepository, "findTransaction").resolves(null);

    try {
      await TransactionService.findTransaction(invalidTransactionId);
      expect.fail("Expected an error but none was thrown");
    } catch (error) {
      expect(error).to.be.an.instanceOf(Error);
    }
  });
});
