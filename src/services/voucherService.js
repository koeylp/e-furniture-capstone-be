const { BadRequestError, ForbiddenError } = require("../utils/errorHanlder");
const VoucherRepository = require("../models/repositories/voucherRepository");
const ProductRepository = require("../models/repositories/productRepository");
const AccountRepository = require("../models/repositories/accountRepository");
const { calculateOrderTotal } = require("../utils/calculator");

const TYPE = {
  FIXED_AMOUNT: "fixed_amoount",
  PERCENTAGE: "percentage",
};
class VoucherService {
  static async handleVoucher(voucher_id) {
    const found_voucher = await VoucherRepository.findById(voucher_id);
    if (!found_voucher)
      throw new BadRequestError(`Voucher ${voucher._id} not found`);
    return found_voucher;
  }

  static async createVoucher(voucher) {
    if (voucher.type === TYPE.PERCENTAGE && voucher.value > 100)
      throw new BadRequestError(
        `Voucher type ${voucher.type} must be less than 100`
      );

    return await VoucherRepository.create(voucher);
  }

  static async getAllActiveVouchers() {
    const QUERY = { is_active: 1 };
    const SORT = [["createdAt", -1]];
    return await VoucherRepository.findAllByActive(QUERY, SORT);
  }

  static async applyVoucher(account_id, voucher_id, products) {
    const found_account = await AccountRepository.findAccountById(account_id);
    if (!found_account)
      throw new BadRequestError(`Account ${account_id} not found`);

    const found_voucher = await VoucherService.handleVoucher(voucher_id);

    await VoucherService.validateVoucher(found_voucher, account_id);

    const order_total = calculateOrderTotal(products);

    const result = await VoucherService.applyDiscount(
      found_voucher,
      products,
      order_total
    );

    await VoucherService.updateVoucherUsage(found_voucher, account_id);

    const updatedVoucher = await VoucherRepository.save(found_voucher);
    if (!updatedVoucher)
      throw new ForbiddenError(
        `Voucher ${found_voucher._id} was applied failed`
      );

    return result;
  }

  static async validateVoucher(found_voucher, account_id) {
    if (found_voucher.used_turn_count === found_voucher.maximum_use)
      throw new ForbiddenError("Voucher has reached its maximum usage");

    const date = Date.now();
    if (found_voucher.start_date > date || found_voucher.end_date < date)
      throw new ForbiddenError("Not start or already closed");

    const user_used_index = found_voucher.users_used.findIndex(
      (el) => el.account_id === account_id
    );

    if (user_used_index !== -1) {
      if (
        found_voucher.users_used[user_used_index].used_count ===
        found_voucher.maximum_use_per_user
      )
        throw new ForbiddenError(
          `Account with id ${account_id} has reached the limited to use this voucher`
        );
    }
  }

  static async applyDiscount(found_voucher, products, order_total) {
    let order_total_after_voucher = 0;

    if (found_voucher.products.length > 0) {
      // Specific products
      products.forEach(async (product) => {
        const found_item_product = found_voucher.products.find(
          (el) => el === product.product_id
        );
        product.new_price = found_item_product
          ? await VoucherService.applySpecificDiscount(
              product.price,
              found_voucher.value,
              found_voucher.type
            )
          : product.price;

        order_total_after_voucher += product.new_price * product.quantity;
      });
    } else {
      // All products
      const discountFactor =
        found_voucher.type === TYPE.FIXED_AMOUNT
          ? found_voucher.value
          : (order_total * found_voucher.value) / 100;

      if (order_total < found_voucher.minimum_order_value)
        throw new ForbiddenError(
          `The total of the total is not greater than or equal to the minimum total order value condition (>= ${found_voucher.minimum_order_value})`
        );

      order_total_after_voucher = order_total - discountFactor;
    }

    return {
      voucher: found_voucher,
      product: products,
      old_order_total: order_total,
      order_total_after_voucher: order_total_after_voucher,
    };
  }

  static async applySpecificDiscount(price, value, type) {
    switch (type) {
      case TYPE.FIXED_AMOUNT:
        return price - value;
      case TYPE.PERCENTAGE:
        return price * (1 - value / 100);
      default:
        return price;
    }
  }

  static async updateVoucherUsage(found_voucher, account_id) {
    const user_used_index = found_voucher.users_used.findIndex(
      (el) => el.account_id === account_id
    );

    if (user_used_index === -1)
      found_voucher.users_used.push({
        account_id: account_id,
        used_count: 1,
      });
    else {
      found_voucher.users_used[user_used_index].used_count++;
    }

    found_voucher.used_turn_count++; // increase used_turn_count
  }
}

module.exports = VoucherService;
