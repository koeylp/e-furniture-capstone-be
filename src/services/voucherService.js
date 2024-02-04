const { BadRequestError, ForbiddenError } = require("../utils/errorHanlder");
const VoucherRepository = require("../models/repositories/voucherRepository");
const ProductRepository = require("../models/repositories/productRepository");
const AccountRepository = require("../models/repositories/accountRepository");

const TYPE = {
  FIXED_AMOUNT: "fixed_amoount",
  PERCENTAGE: "percentage",
};
class VoucherService {
  static async handleVoucher(voucher) {
    const found_voucher = await VoucherRepository.findById(voucher);
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

  static async applyVoucher(account_id, voucher) {
    const found_account = await AccountRepository.findAccountById(account_id);
    if (!found_account)
      throw new BadRequestError(`Account ${account_id} not found`);
    const found_voucher = await VoucherService.handleVoucher(voucher);
    // check limited used vouchers
    if (found_voucher.used_turn_count < found_voucher.maximum_use) {
      const user_used_index = found_voucher.users_used.findIndex(
        (el) => el.account_id === account_id
      );

      // check limited per user usage
      if (user_used_index !== -1) {
        if (
          found_voucher.users_used[user_used_index].used_count ===
          found_voucher.maximum_use_per_user
        )
          throw new ForbiddenError(
            `Account with id ${account_id} has reached the limited to use this voucher`
          );
      }

      var order_total_after_voucher = 0; // initalize variable for the order of total after discount
      var order_total = 0; // total of the chosen products in cart for checkout || before discount
      let temp_minus_order_voucher = 0; // initalize variable for minusing total after discount
      voucher.items.forEach((el) => {
        order_total += el.price * el.quantity;
      });
      // check "all" or "specific"
      if (found_voucher.products.length > 0) {
        // -------- specific --------
        voucher.items.map((product) => {
          const found_item_product = found_voucher.products.find(
            (el) => el === product.product_id
          );
          if (found_item_product) {
            switch (found_voucher.type) {
              case TYPE.FIXED_AMOUNT:
                product.new_price = product.price - found_voucher.value;
                break;
              case TYPE.PERCENTAGE:
                product.new_price =
                  product.price * (1 - found_voucher.value / 100);
                break;
            }
          } else {
            product.new_price = product.price;
          }
          order_total_after_voucher += product.new_price * product.quantity;
        });
        var result = {
          voucher: found_voucher,
          product: voucher.items,
          old_order_total: order_total,
          order_total_after_voucher: order_total_after_voucher,
        };
      } else {
        // -------- all --------
        switch (found_voucher.type) {
          case TYPE.FIXED_AMOUNT:
            temp_minus_order_voucher = found_voucher.value;
            break;
          case TYPE.PERCENTAGE:
            temp_minus_order_voucher =
              (order_total * found_voucher.value) / 100;
            break;
        }
        if (order_total < found_voucher.minimum_order_value)
          throw new ForbiddenError(
            `The total of the total is not greater than or equal to the minimum total order value condition (>= ${found_voucher.minimum_order_value})`
          );
        order_total_after_voucher = order_total - temp_minus_order_voucher; // minus discount factor
        var result = {
          voucher: found_voucher,
          total_after_applying_voucher: order_total_after_voucher,
          old_order_total: order_total,
        };
      }
      if (user_used_index === -1)
        // users_used [{ _id: ___, used_count: ___ }]
        found_voucher.users_used.push({
          account_id: account_id,
          used_count: 1,
        });
      else {
        found_voucher.users_used[user_used_index].used_count++;
      }

      found_voucher.used_turn_count++; // increase used_turn_count

      const updatedVoucher = await VoucherRepository.save(found_voucher);
      if (!updatedVoucher)
        throw new ForbiddenError(
          `Voucher ${found_voucher._id} was applied failed`
        );
    } else {
      throw new ForbiddenError("Voucher has reached its maximum usage");
    }

    return result;
  }
}

module.exports = VoucherService;
