const sinon = require("sinon");
const chai = require("chai");
const sinonChai = require("sinon-chai");

const NotificationEfurnitureRepository = require("../../../../src/models/repositories/notificationEfurnitureRepository");
const NotificationEfurnitureService = require("../../../../src/services/NotificationEfurnitureService");

chai.use(sinonChai);

const { expect } = chai;

describe("NotificationEfurnitureService", () => {
  beforeEach(() => {
    sinon.stub(NotificationEfurnitureRepository, "create").resolves({});
    sinon
      .stub(NotificationEfurnitureRepository, "getNotifications")
      .resolves([]);
    sinon
      .stub(NotificationEfurnitureRepository, "getNotificationsForAdmin")
      .resolves([]);
    sinon
      .stub(NotificationEfurnitureRepository, "getNotificationsForStaff")
      .resolves([]);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createNotification", () => {
    it("should create a new notification", async () => {
      const payload = {
        title: "Test Notification",
        message: "This is a test message",
      };
      const createdNotification =
        await NotificationEfurnitureService.createNotification(payload);
      expect(NotificationEfurnitureRepository.create).to.have.been.calledWith(
        payload
      );
      expect(createdNotification).to.be.an("object"); // Assert basic structure
    });
  });

  describe("getNotifications", () => {
    it("should get all notifications", async () => {
      const notifications =
        await NotificationEfurnitureService.getNotifications();
      expect(NotificationEfurnitureRepository.getNotifications).to.have.been
        .calledOnce;
      expect(notifications).to.be.an("array"); // Empty array if no notifications
    });
  });

  describe("getNotificationsForAdmin", () => {
    it("should get notifications for admin", async () => {
      const notifications =
        await NotificationEfurnitureService.getNotificationsForAdmin();
      expect(NotificationEfurnitureRepository.getNotificationsForAdmin).to.have
        .been.calledOnce;
      expect(notifications).to.be.an("array"); // Empty array if no notifications
    });
  });

  describe("getNotificationsForStaff", () => {
    it("should get notifications for staff", async () => {
      const notifications =
        await NotificationEfurnitureService.getNotificationsForStaff();
      expect(NotificationEfurnitureRepository.getNotificationsForStaff).to.have
        .been.calledOnce;
      expect(notifications).to.be.an("array"); // Empty array if no notifications
    });
  });

  describe("notiLowStock", () => {
    it("should create a notification for low stock and emit an event", async () => {
      const mockSocket = { emit: sinon.stub() };
      global._io = mockSocket; // Simulate socket.io for testing

      const productName = "Test Product";
      await NotificationEfurnitureService.notiLowStock(productName);

      const expectedPayload = {
        title: "Low Stock!",
        message: `Low Stock With Product Name is ${productName}`,
        status: 1,
      };
      expect(NotificationEfurnitureRepository.create).to.have.been.calledWith(
        expectedPayload
      );
      expect(mockSocket.emit).to.have.been.calledOnceWith(
        "lowstockWareHouse",
        true
      );
    });
  });

  describe("notiRequestDeliveryTrip", () => {
    it("should create a notification for delivery trip request and emit an event", async () => {
      const mockSocket = { emit: sinon.stub() };
      global._io = mockSocket; // Simulate socket.io for testing

      await NotificationEfurnitureService.notiRequestDeliveryTrip();

      const expectedPayload = {
        title: "Request Delivery Trip!",
        message: "New Delivery Trip Has Been Request",
        status: 2,
      };
      expect(NotificationEfurnitureRepository.create).to.have.been.calledWith(
        expectedPayload
      );
      expect(mockSocket.emit).to.have.been.calledOnceWith(
        "requestDeliveryTrip",
        true
      );
    });
  });
});
