const { default: mongoose } = require("mongoose");
const {
  getUnSelectData,
  checkValidId,
  removeUndefineObject,
} = require("../../utils");
const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
} = require("../../utils/errorHanlder");
const _FlashSale = require("../flashSaleModel");
class FlashSaleRepository {
  static async createFlashSale(payload) {
    const flashSale = await _FlashSale.create(payload);
    if (!flashSale) throw new InternalServerError();
    return flashSale;
  }

  static async getFlashSales(query = {}, option = []) {
    return await _FlashSale
      .find(query)
      .populate("products.productId")
      .select(getUnSelectData(option))
      .lean();
  }
  static async getFlashSalesWithoutPopulate(query = {}, option = []) {
    return await _FlashSale.find(query).select(getUnSelectData(option)).lean();
  }

  static async findFlashSale(query = {}) {
    return await _FlashSale.findOne(query).lean();
  }

  static async findFlashSaleById(flashSale_id) {
    checkValidId(flashSale_id);
    const query = {
      _id: new mongoose.Types.ObjectId(flashSale_id),
    };
    const flashSale = await this.findFlashSale(query);
    if (!flashSale) throw new NotFoundError();
    return flashSale;
  }

  static async update(query, update) {
    update = removeUndefineObject(update);
    const result = await _FlashSale.updateOne(query, update, { new: true });
    if (!result) throw new BadRequestError("Cannot Update FlashSale!");
    return result;
  }

  static async updateById(flashSale_id, payload) {
    const query = {
      _id: new mongoose.Types.ObjectId(flashSale_id),
    };
    return await this.update(query, payload);
  }

  static async publishFlashSale(flashSale_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(flashSale_id),
    };
    const update = {
      is_draft: false,
      is_published: true,
    };
    return await this.update(query, update);
  }

  static async draftFlashSale(flashSale_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(flashSale_id),
    };
    const update = {
      is_draft: true,
      is_published: false,
    };
    return await this.update(query, update);
  }

  static async remove(flashSale_id) {
    checkValidId(flashSale_id);
    const query = {
      _id: new mongoose.Types.ObjectId(flashSale_id),
    };
    return await _FlashSale.deleteOne(query);
  }
}
module.exports = FlashSaleRepository;
