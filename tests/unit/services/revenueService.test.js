const sinon = require("sinon");
const chai = require("chai");
const RevenueRepository = require("../../../src/models/repositories/revenueRepository");
const RevenueService = require("../../../src/services/revenueService");
const OrderRepository = require("../../../src/models/repositories/orderRepository");
const { BadRequestError } = require("../../../src/utils/errorHanlder");
const expect = chai.expect;

describe("RevenueService", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("addRevenue", () => {
    it("should add revenue for the specified day", async () => {
      const mockProfit = 1000;
      const mockDay = new Date();

      sinon
        .stub(RevenueRepository, "updateOrInsert")
        .resolves({ profit: mockProfit });

      const result = await RevenueService.addRevenue(mockProfit, mockDay);
      expect(result.profit).to.equal(mockProfit);
    });
  });

  describe("addRevenueOrder", () => {
    it("should add revenue based on order deposit and amount", async () => {
      const mockOrderId = "mock_order_id";
      const mockOrderAmount = 500;
      const mockOrder = {
        _id: mockOrderId,
        order_checkout: {
          paid: { paid_amount: 200 },
        },
      };

      sinon.stub(OrderRepository, "findOrderById").resolves(mockOrder);
      sinon.stub(RevenueService, "addRevenue").resolves({ profit: 700 });

      const result = await RevenueService.addRevenueOrder(
        mockOrderId,
        mockOrderAmount
      );
      expect(result.profit).to.equal(700);
    });
  });

  describe("getRevenueToday", () => {
    it("should get revenue for today", async () => {
      const mockRevenue = { profit: 1500 };

      sinon.stub(RevenueRepository, "findRevenue").resolves(mockRevenue);

      const result = await RevenueService.getRevenueToday();
      expect(result.profit).to.equal(mockRevenue.profit);
    });
  });

  describe("getRevenueByDate", () => {
    it("should get revenue for the specified date", async () => {
      const mockDate = "2024-04-20";
      const mockRevenue = { profit: 2000 };

      sinon.stub(RevenueRepository, "findRevenue").resolves(mockRevenue);

      const result = await RevenueService.getRevenueByDate(mockDate);
      expect(result.profit).to.equal(mockRevenue.profit);
    });
  });

  describe("getRevenueByDateRange", () => {
    it("should get revenue for the specified date range", async () => {
      const mockStartDay = "2024-04-15";
      const mockEndDay = "2024-04-20";
      const mockRevenues = [{ profit: 1000 }, { profit: 1500 }];

      sinon.stub(RevenueRepository, "getRevenues").resolves(mockRevenues);

      const result = await RevenueService.getRevenueByDateRange(
        mockStartDay,
        mockEndDay
      );
      expect(result.sum).to.equal(2500);
      expect(result.data.length).to.equal(2);
    });

    it("should throw BadRequestError if start date is after end date", async () => {
      const mockStartDay = "2024-04-20";
      const mockEndDay = "2024-04-15";

      try {
        await RevenueService.getRevenueByDateRange(mockStartDay, mockEndDay);
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Start Date must before End Date!");
      }
    });
  });

  describe("validateRevenue", () => {
    it("should throw BadRequestError if profit is negative", async () => {
      const negativeProfit = -100;

      try {
        await RevenueService.validateRevenue(negativeProfit);
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Profit must greater than 0!");
      }
    });

    it("should not throw error if profit is zero or positive", async () => {
      const zeroProfit = 0;
      const positiveProfit = 100;

      expect(() => RevenueService.validateRevenue(zeroProfit)).to.not.throw();
      expect(() =>
        RevenueService.validateRevenue(positiveProfit)
      ).to.not.throw();
    });
  });
});
