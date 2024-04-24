const { expect } = require("chai");
const sinon = require("sinon");
const VoucherRepository = require("../../../src/models/repositories/voucherRepository");
const VoucherService = require("../../../src/services/voucherService");
const { BadRequestError } = require("../../../src/utils/errorHanlder");
const VoucherUtil = require("../../../src/utils/voucherUtil");
const AccountRepository = require("../../../src/models/repositories/accountRepository");

describe("VoucherService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("handleVoucher", () => {
    it("should throw error if voucher is not found", async () => {
      sinon.stub(VoucherRepository, "findById").resolves({});
      try {
        await VoucherService.handleVoucher("nonexistent_id");
      } catch (error) {
        expect(error.message).to.equal("Voucher nonexistent_id not found");
      }
    });

    it("should return the found voucher", async () => {
      const foundVoucher = {
        name: "International Woman's Day24",
        description:
          "Happy International Men's Day 19/3, eFurniture wishes your day filled with joy!",
        type: "percentage",
        code: "MENDAY1",
        value: 10,
        max_discount: 10000,
        start_date: "2024-04-02 23:59:59",
        end_date: "2024-04-10 23:59:59",
        maximum_use: 8,
        maximum_use_per_user: 4,
        minimum_order_value: 199999,
        is_active: 1,
        products: ["66110943d046e46a06d70dd4"],
      };
      sinon.stub(VoucherRepository, "findById").resolves(foundVoucher);
      const result = await VoucherService.handleVoucher("valid_id");
      expect(result).to.deep.equal(foundVoucher);
    });
  });

  describe("createVoucher", () => {
    it("should create a new voucher", async () => {
      const voucher = {
        name: "International Woman's Day24",
        description:
          "Happy International Men's Day 19/3, eFurniture wishes your day filled with joy!",
        type: "percentage",
        code: "MENDAY1",
        value: 10,
        max_discount: 10000,
        start_date: "2024-04-02 23:59:59",
        end_date: "2024-04-10 23:59:59",
        maximum_use: 8,
        maximum_use_per_user: 4,
        minimum_order_value: 199999,
        is_active: 1,
        products: ["66110943d046e46a06d70dd4"],
      };
      sinon.stub(VoucherUtil, "validateCreatingVoucher");
      sinon.stub(VoucherRepository, "create").resolves(voucher);
      const createdVoucher = await VoucherService.createVoucher(voucher);
      expect(createdVoucher).to.deep.equal(voucher);
    });
  });

  describe("getAllVouchers", () => {
    it("should return all vouchers", async () => {
      const allVouchers = [
        {
          name: "International Woman's Day24",
          description:
            "Happy International Men's Day 19/3, eFurniture wishes your day filled with joy!",
          type: "percentage",
          code: "MENDAY1",
          value: 10,
          max_discount: 10000,
          start_date: "2024-04-02 23:59:59",
          end_date: "2024-04-10 23:59:59",
          maximum_use: 8,
          maximum_use_per_user: 4,
          minimum_order_value: 199999,
          is_active: 1,
          products: ["66110943d046e46a06d70dd4"],
        },
      ];
      sinon.stub(VoucherRepository, "findAllByQuery").resolves(allVouchers);
      const result = await VoucherService.getAllVouchers();
      expect(result).to.deep.equal(allVouchers);
    });
  });

  describe("applyVoucher", () => {
    it("should apply voucher successfully", async () => {
      const account_id = "valid_account_id";
      const voucher_id = "valid_voucher_id";
      const products = ["66110943d046e46a06d70dd4"];
      const foundAccount = {
        _id: "65d54804e9dc44212f7d9a62",
        username: "giabao",
        first_name: "Đoàn",
        last_name: "Bảoo",
        email: "baocute@gmail.com",
        role: 30,
        status: 1,
        createdAt: "2024-02-21T00:47:00.878Z",
        updatedAt: "2024-03-26T03:30:02.904Z",
      };
      const foundVoucher = {
        name: "International Woman's Day24",
        description:
          "Happy International Men's Day 19/3, eFurniture wishes your day filled with joy!",
        type: "percentage",
        code: "MENDAY1",
        value: 10,
        max_discount: 10000,
        start_date: "2024-04-02 23:59:59",
        end_date: "2024-04-10 23:59:59",
        maximum_use: 8,
        maximum_use_per_user: 4,
        minimum_order_value: 199999,
        is_active: 1,
        products: ["66110943d046e46a06d70dd4"],
      };
      sinon.stub(AccountRepository, "findAccountById").resolves(foundAccount);
      sinon.stub(VoucherService, "handleVoucher").resolves(foundVoucher);
      sinon.stub(VoucherUtil, "validateVoucher");
      sinon.stub(VoucherUtil, "applyDiscount").resolves({});
      sinon.stub(VoucherUtil, "updateVoucherUsage");

      const result = await VoucherService.applyVoucher(
        account_id,
        voucher_id,
        products
      );

      expect(result).to.deep.equal({});
      sinon.assert.calledOnceWithExactly(
        VoucherUtil.updateVoucherUsage,
        foundVoucher,
        account_id
      );
    });

    it("should throw BadRequestError when account is not found", async () => {
      sinon.stub(AccountRepository, "findAccountById").resolves(null);
      try {
        await VoucherService.applyVoucher(
          "nonexistent_account_id",
          "valid_voucher_id",
          []
        );
      } catch (error) {
        expect(error).to.be.instanceOf(BadRequestError);
        expect(error.message).to.equal(
          "Account nonexistent_account_id not found"
        );
      }
    });

    it("should throw error when voucher has reached its maxium usage", async () => {
      sinon.stub(AccountRepository, "findAccountById").resolves({});
      sinon.stub(VoucherService, "handleVoucher").resolves({});
      try {
        await VoucherService.applyVoucher(
          "valid_account_id",
          "nonexistent_voucher_id",
          []
        );
      } catch (error) {
        expect(error.message).to.equal("Voucher has reached its maximum usage");
      }
    });

    it("should handle errors thrown during voucher application", async () => {
      const account_id = "valid_account_id";
      const voucher_id = "valid_voucher_id";
      const products = [{}];

      const foundAccount = {};
      const foundVoucher = {};
      sinon.stub(AccountRepository, "findAccountById").resolves(foundAccount);
      sinon.stub(VoucherService, "handleVoucher").resolves(foundVoucher);
      sinon.stub(VoucherUtil, "validateVoucher");
      sinon
        .stub(VoucherUtil, "applyDiscount")
        .throws(new Error("Failed to apply voucher"));

      try {
        await VoucherService.applyVoucher(account_id, voucher_id, products);
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal("Failed to apply voucher");
      }
    });
  });
  describe("getBySpecified", () => {
    it("should return active vouchers based on specified products", async () => {
      const products = [
        { product_id: "660ccfe9648646f9aae4cfff", price: 5000000 },
        { product_id: "661ccfe9648646f9aae4cffa", price: 1000000 },
      ];
      const activeVouchers = [
        {
          _id: "6614c401a5582d6670aa3494",
          name: "International Woman's Day2",
          description:
            "Happy International Men's Day 19/3, eFurniture wishes your day filled with joy!",
          type: "percentage",
          value: 10,
          max_discount: 10000,
          code: "MENDAY81311",
          start_date: "2024-04-02T16:59:59.000Z",
          end_date: "2024-04-30T16:59:59.000Z",
          maximum_use: 8,
          used_turn_count: 0,
          users_used: [],
          maximum_use_per_user: 4,
          minimum_order_value: 199999,
          is_active: 1,
          products: [],
          createdAt: "2024-04-09T04:28:49.111Z",
          updatedAt: "2024-04-09T04:28:49.111Z",
        },
      ];

      sinon.stub(VoucherRepository, "findAllByQuery").resolves(activeVouchers);

      const result = await VoucherService.getBySpecified(products);

      expect(result).to.deep.equal(activeVouchers);
    });

    it("should return an empty array if no vouchers match the specified products", async () => {
      const products = [
        { product_id: "product_id_3", price: 200 },
        { product_id: "product_id_4", price: 150 },
      ];
      sinon.stub(VoucherRepository, "findAllByQuery").resolves([]);

      const result = await VoucherService.getBySpecified(products);

      expect(result).to.be.an("array").that.is.empty;
    });
  });

  describe("removeVoucher", () => {
    it("should remove the voucher successfully", async () => {
      const voucher_id = "valid_voucher_id";
      const deleteResult = {};

      sinon.stub(VoucherRepository, "removeVoucher").resolves(deleteResult);

      const result = await VoucherService.removeVoucher(voucher_id);

      expect(result).to.deep.equal(deleteResult);
    });

    it("should throw an error if voucher removal fails", async () => {
      const voucher_id = "invalid_voucher_id";
      const errorMessage = "Failed to remove voucher";
      sinon
        .stub(VoucherRepository, "removeVoucher")
        .rejects(new Error(errorMessage));

      try {
        await VoucherService.removeVoucher(voucher_id);
        expect.fail("Expected error to be thrown");
      } catch (error) {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal(errorMessage);
      }
    });
  });
});
