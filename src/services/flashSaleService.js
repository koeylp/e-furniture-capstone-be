const FlashSaleRepository = require("../models/repositories/flashSaleRepository");
const FlashSaleUtils = require("../utils/flashSaleUtils");
class FlashSaleService {
  static async create(payload) {
    FlashSaleUtils.validateDate(payload.startDay, payload.endDay);
    await FlashSaleUtils.validateProducts(payload.products);
    return await FlashSaleRepository.createFlashSale(payload);
  }
  static async getFlashSales() {
    return await FlashSaleRepository.getFlashSales();
  }
  static async findFlashSaleById(flashSale_id) {
    return await FlashSaleRepository.findFlashSaleById(flashSale_id);
  }
  static async update(flashSale_id, payload) {
    FlashSaleUtils.validateDate(payload.startDay, payload.endDay);
    await FlashSaleUtils.validateProducts(payload.products);
    return await FlashSaleRepository.updateById(flashSale_id, payload);
  }
  static async publish(flashSale_id) {
    const result = await FlashSaleRepository.publishFlashSale(flashSale_id);
    await FlashSaleUtils.processDateRange(
      result.startDay,
      result.endDay,
      result.products
    );
    return result;
  }
  static async draft(flashSale_id) {
    return await FlashSaleRepository.draftFlashSale(flashSale_id);
  }
  static async remove(flashSale_id) {
    return await FlashSaleRepository.remove(flashSale_id);
  }
}
module.exports = FlashSaleService;
