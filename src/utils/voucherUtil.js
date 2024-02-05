const { ForbiddenError } = require("../utils/errorHanlder");

const TYPE = {
  FIXED_AMOUNT: "fixed_amoount",
  PERCENTAGE: "percentage",
};

class VoucherUtil {
  static async validateVoucher(found_voucher, account_id) {
    if (found_voucher.used_turn_count === found_voucher.maximum_use) {
      found_voucher.is_active = 0;
      throw new ForbiddenError("Voucher has reached its maximum usage");
    }

    const date = Date.now();
    if (found_voucher.start_date > date || found_voucher.end_date < date) {
      throw new ForbiddenError("Not yet start or already closed");
    }

    const user_used_index = found_voucher.users_used.findIndex(
      (el) => el.account_id === account_id
    );

    if (
      user_used_index !== -1 &&
      found_voucher.users_used[user_used_index].used_count ===
        found_voucher.maximum_use_per_user
    ) {
      throw new ForbiddenError(
        `Account with id ${account_id} has reached the limited to use this voucher`
      );
    }
  }

  static async applyDiscount(found_voucher, products, order_total) {
    let order_total_after_voucher = 0;

    const applyDiscountToProduct = async (product) => {
      const found_item_product = found_voucher.products.find(
        (el) => el === product.product_id
      );
      product.new_price = found_item_product
        ? await VoucherUtil.applySpecificDiscount(
            product.price,
            found_voucher.value,
            found_voucher.type
          )
        : product.price;

      order_total_after_voucher += product.new_price * product.quantity;
    };

    const applyDiscountToAllProducts = () => {
      const discountFactor =
        found_voucher.type === TYPE.FIXED_AMOUNT
          ? found_voucher.value
          : (order_total * found_voucher.value) / 100;

      if (order_total < found_voucher.minimum_order_value)
        throw new ForbiddenError(
          `The total of the total is not greater than or equal to the minimum total order value condition (>= ${found_voucher.minimum_order_value})`
        );

      order_total_after_voucher = order_total - discountFactor;
    };

    if (found_voucher.products.length > 0) {
      // Specific products
      await Promise.all(products.map(applyDiscountToProduct));
    } else {
      // All products
      applyDiscountToAllProducts();
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

    user_used_index === -1
      ? found_voucher.users_used.push({ account_id, used_count: 1 })
      : found_voucher.users_used[user_used_index].used_count++;

    found_voucher.used_turn_count++; // increase used_turn_count
  }

  static async validateCreatingVoucher(voucher) {
    if (voucher.type === TYPE.PERCENTAGE && voucher.value > 100)
      throw new BadRequestError(
        `Voucher type ${voucher.type} must be less than 100`
      );

    if (voucher.maximum_use < voucher.maximum_use_per_user)
      throw new ForbiddenError(
        "the maximum use turn must be greater than maximum use per user"
      );
  }
}

module.exports = VoucherUtil;
