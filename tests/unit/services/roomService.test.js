const sinon = require("sinon");
const { expect } = require("chai");
const RoomRepository = require("../../../src/models/repositories/roomRepository");
const RoomService = require("../../../src/services/roomService");
const { BadRequestError } = require("../../../src/utils/errorHanlder");

describe("RoomService", () => {
  describe("createRoom", () => {
    it("should throw BadRequestError when room name is already in use", async () => {
      sinon.stub(RoomRepository, "findRoomByName").resolves({});

      try {
        await RoomService.createRoom({
          name: "existing_room_name",
          products: [],
        });
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Room name is already in use!");
      }
    });

    it("should throw BadRequestError when creating a room without a name", async () => {
      const roomPayload = { products: [] };

      try {
        await RoomService.createRoom(roomPayload);
      } catch (error) {
        expect(error).to.be.an.instanceOf(BadRequestError);
        expect(error.message).to.equal("Room name is already in use!");
      }
    });
  });

  describe("getRooms", () => {
    it("should return rooms with pagination", async () => {
      const page = 1;
      const limit = 10;
      const mockRooms = [{ name: "room1" }, { name: "room2" }];
      sinon.stub(RoomRepository, "getRooms").resolves(mockRooms);

      const result = await RoomService.getRooms(page, limit);

      expect(result).to.deep.equal(mockRooms);
    });
  });

  it("should enable an existing room", async () => {
    const existingRoomSlug = "existing_room_slug";
    const mockedRoom = {
      _id: "mocked_id",
      name: "existing_room_name",
      slug: existingRoomSlug,
      is_draft: true,
      is_published: false,
    };
    sinon.stub(RoomRepository, "findRoomBySlug").resolves(mockedRoom);
    sinon.stub(RoomRepository, "publishRoom").resolves(mockedRoom);

    const enabledRoom = await RoomService.enableRoom(existingRoomSlug);

    expect(enabledRoom).to.deep.equal(mockedRoom);
  });

  it("should throw BadRequestError when enabling a non-existing room", async () => {
    const nonExistingRoomId = "non_existing_room_id";
    sinon.stub(RoomRepository, "findRoomById").resolves(null);

    try {
      await RoomService.enableRoom(nonExistingRoomId);
    } catch (error) {
      expect(error).to.be.instanceOf(BadRequestError);
      expect(error.message).to.equal(`Room ${nonExistingRoomId} not found`);
    }
  });
});
