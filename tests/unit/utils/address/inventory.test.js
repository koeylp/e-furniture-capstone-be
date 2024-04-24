const { describe, it } = require("mocha");
const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");
const InventoryService = require("../../../../src/services/inventoryService");
const { BadRequestError } = require("../../../../src/utils/errorHanlder");
const InventoryRepository = require("../../../../src/models/repositories/inventoryRepository");

chai.use(sinonChai);

const { expect } = chai;
describe("InventoryService", () => {
  beforeEach(() => {
    sinon.stub(InventoryRepository, "createInventory").resolves({});
    sinon.stub(InventoryRepository, "findByQuery").resolves({});
    sinon.stub(InventoryRepository, "save").resolves({});
  });

  afterEach(() => {
    sinon.restore();
  });

  //   describe("findInventoryByCode", () => {
  //     it("should find inventory by code", async () => {
  //       const code = "TEST_CODE";
  //       const mockInventory = { code };
  //       const inventory = await InventoryService.findInventoryByCode(code);
  //       expect(inventory).to.deep.equal(mockInventory);
  //     });

  //     it("should throw error for non-existent inventory", async () => {
  //       const code = "INVALID_CODE";
  //       sinon.stub(InventoryRepository, "findByQuery").resolves(null);
  //       try {
  //         await InventoryService.findInventoryByCode(code);
  //         // Should not reach here if throws error
  //         expect(false).to.equal(true); // Assertion to fail if no error is thrown
  //       } catch (error) {
  //         expect(error).to.be.an.instanceof(NotFoundError);
  //         expect(error.message).to.equal(
  //           "Inventory not found with specific product"
  //         );
  //       }
  //     });
  //   });

  describe("updateInventoryStock", () => {
    //   it("should update inventory stock", async () => {
    //     const product = { code: "TEST_CODE", stock: 20 };
    //     const mockInventory = { _id: "123", stock: 10 }; // Mocked existing inventory
    //     sinon
    //       .stub(InventoryService, "findInventoryByCode")
    //       .resolves(mockInventory);
    //     sinon.stub(InventoryService, "updateInventory").resolves({});

    //     const updatedInventory = await InventoryService.updateInventoryStock(
    //       product
    //     );
    //     expect(InventoryService.findInventoryByCode).to.have.been.calledWith(
    //       product.code
    //     );
    //     expect(InventoryService.validateStock).to.have.been.calledWith(
    //       product.stock
    //     ); // Validate stock before update
    //     expect(mockInventory.stock).to.equal(product.stock); // Verify stock update
    //     expect(InventoryRepository.save).to.have.been.calledWith(
    //       mockInventory._id,
    //       mockInventory.sold,
    //       mockInventory.stock
    //     );
    //     expect(updatedInventory).to.be.an("object"); // Assert basic structure (might be empty)
    //   });

    it("should throw error for invalid stock value (negative)", async () => {
      const product = { code: "TEST_CODE", stock: -5 };
      try {
        await InventoryService.updateInventoryStock(product);
        // Should not reach here if throws error
        expect(false).to.equal(true); // Assertion to fail if no error is thrown
      } catch (error) {
        expect(error).to.be.an.instanceof(BadRequestError);
        expect(error.message).to.equal("Stock value is invalid!");
      }
    });
  });

  describe("updateInventorySold", () => {
    it("should throw error for invalid stock value (negative)", async () => {
      const product = { code: "TEST_CODE", stock: -5 };
      try {
        await InventoryService.updateInventorySold(product);
        // Should not reach here if throws error
        expect(false).to.equal(true); // Assertion to fail if no error is thrown
      } catch (error) {
        expect(error).to.be.an.instanceof(BadRequestError);
        expect(error.message).to.equal("Stock value is invalid!");
      }
    });
  });

  describe("updateInventory", () => {
    it("should update inventory data in the database", async () => {
      const inventory = { _id: "123", sold: 10, stock: 20 };
      const updatedInventory = await InventoryService.updateInventory(
        inventory
      );
      expect(InventoryRepository.save).to.have.been.calledWith(
        inventory._id,
        inventory.sold,
        inventory.stock
      );
    });
  });

  describe("validateStock", () => {
    it("should not throw error for valid stock value (positive)", () => {
      const stock = 10;
      expect(() => InventoryService.validateStock(stock)).not.to.throw();
    });

    it("should throw error for invalid stock value (zero)", () => {
      const stock = 0;
      try {
        InventoryService.validateStock(stock);
        // Should not reach here if throws error
        expect(false).to.equal(true); // Assertion to fail if no error is thrown
      } catch (error) {
        expect(error).to.be.an.Throw;
      }
    });

    it("should throw error for invalid stock value (negative)", () => {
      const stock = -5;
      try {
        InventoryService.validateStock(stock);
        // Should not reach here if throws error
        expect(false).to.equal(true); // Assertion to fail if no error is thrown
      } catch (error) {
        expect(error).to.be.an.instanceof(BadRequestError);
        expect(error.message).to.equal("Stock value is invalid!");
      }
    });
  });
});
