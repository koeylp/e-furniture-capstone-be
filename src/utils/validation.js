// src/utils/validation.js
const Joi = require("joi");

const validateEmail = (email) => {
  const schema = Joi.string().email().required();

  return schema.validate(email);
};

const validateUsername = (username) => {
  const schema = Joi.string().alphanum().min(3).max(30).required().messages({
    "string.alphanum": "Username must only contain alphanumeric characters.",
    "string.min": "Username must have at least {#limit} characters.",
    "string.max": "Username cannot exceed {#limit} characters.",
  });

  return schema.validate(username);
};

const validatePassword = (password) => {
  const schema = Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .label("Password")
    .messages({
      "string.min": "{#label} length must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit.",
    });

  return schema.validate(password);
};

const validatePhoneNumber = (phoneNumber) => {
  const schema = Joi.string()
    .pattern(/^((84|0)+([3|5|7|8|9]))+([0-9]{8,9})\b/)
    .required()
    .messages({
      "string.pattern.base": "Please enter a valid Vietnam phone number.",
    });

  return schema.validate(phoneNumber);
};
const validateCreateRoom = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    description: Joi.string().min(3).required(),
    thumb: Joi.string().min(3).required(),
    products: Joi.array().required(),
  });
  return schema.validate(data);
};
const validateEditRoom = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20),
    description: Joi.string().min(3),
    thumb: Joi.string().min(3),
    products: Joi.array().required(),
  });
  return schema.validate(data);
};
const validateCreateAddress = (data) => {
  const schema = Joi.object({
    phone: Joi.string().required(),
    province: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
    address: Joi.string().required(),
    isDefault: Joi.boolean(),
  });
  return schema.validate(data);
};
const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string(),
    status: Joi.number(),
  });
  return schema.validate(data);
};
const validateCreateAccount = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    role: Joi.array(),
    email: Joi.string(),
    status: Joi.number(),
  });
  return schema.validate(data);
};

const validateCreateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    thumbs: Joi.array().required(),
    description: Joi.string().required(),
    regular_price: Joi.number().min(1).required(),
    sale_price: Joi.number().min(0),
    variation: Joi.array()
      .required()
      .items(
        Joi.object({
          name: Joi.string().min(1).required(),
          properties: Joi.array()
            .required()
            .items(
              Joi.object({
                value: Joi.string().min(1).required(),
                sub_price: Joi.number().min(0).required(),
              })
            ),
        })
      ),
    type: Joi.string().required(),
    room: Joi.string().min(0),
    attributes: Joi.object(),
    model3D: Joi.string().min(0),
    is_draft: Joi.boolean(),
    is_published: Joi.boolean(),
  });
  return schema.validate(data);
};
const validateCreateWareHouse = (data) => {
  const schema = Joi.object({
    location: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required(),
    province: Joi.string().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  });
  return schema.validate(data);
};
const validateCreateSubType = (data) => {
  const schema = Joi.object({
    type_id: Joi.string().required(),
    subType: Joi.string().required(),
    description: Joi.string().min(0),
    thumb: Joi.string().min(0),
    group: Joi.string().required(),
    attributes: Joi.array(),
  });
  return schema.validate(data);
};

const startDateLessThanEndDate = (start, end) => {
  return start < end;
};

const validateVoucherInput = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().valid("fixed_amount", "percentage").required(),
    code: Joi.string().required(),
    value: Joi.number().required(),
    max_discount: Joi.number(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date()
      .iso()
      .required()
      .custom((value, helpers) => {
        const start = helpers.state.ancestors[0].start_date;
        if (!startDateLessThanEndDate(start, value)) {
          return helpers.error("start_date_less_than_end_date", { value });
        }
        return value;
      }),
    maximum_use: Joi.number().required(),
    maximum_use_per_user: Joi.number().default(1),
    minimum_order_value: Joi.number().default(0),
    is_active: Joi.number().valid(0, 1).default(0),
    products: Joi.array().items(Joi.string()),
  }).messages({
    start_date_less_than_end_date: "Start date must be less than end date",
  });
  return schema.validate(data);
};

const validateOrderInput = (data) => {
  const schema = Joi.object({
    order_products: Joi.array().items(orderProductSchema).required(),
    payment_method: Joi.string()
      .valid("Online Payment", "COD")
      .default("Online Payment"),
    order_shipping: orderShippingSchema.required(),
    order_checkout: orderCheckoutSchema.required(),
    note: Joi.string().allow("").optional(),
  });
  return schema.validate(data);
};
const variationSchema = Joi.object({
  property_id: Joi.string().required(),
  sub_price: Joi.number().required(),
  variation_id: Joi.string().required(),
  additionalProperty: Joi.any(),
}).unknown(true);

const orderProductSchema = Joi.object({
  product_id: Joi.string().required(),
  variation: Joi.array().items(variationSchema).required(),
  code: Joi.string().required(),
  quantity: Joi.number().required(),
  price: Joi.number().required(),
  additionalProperty: Joi.any(),
}).unknown(true);

const orderShippingSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  address: Joi.string().required(),
  ward: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string(),
  phone: Joi.string().required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  additionalProperty: Joi.any(),
}).unknown(true);

const orderCheckoutSchema = Joi.object({
  voucher: Joi.any(),
  total: Joi.number().required(),
  final_total: Joi.number().required(),
});

const validateCreateDistrict = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    status: Joi.number(),
  });
  return schema.validate(data);
};
const validateCreateFlashSale = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    startDay: Joi.string().required(),
    endDay: Joi.string().required(),
    thumb: Joi.string().required(),
    background: Joi.string().required(),
    products: Joi.array().required(),
    is_draft: Joi.boolean(),
    is_published: Joi.boolean(),
  });
  return schema.validate(data);
};
const validateUpdateFlashSale = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    startDay: Joi.string().required(),
    endDay: Joi.string().required(),
    products: Joi.array().required(),
  });
  return schema.validate(data);
};
const validateCreateBankInfor = (data) => {
  const schema = Joi.object({
    bank_code: Joi.string().required(),
    account_number: Joi.string().required(),
    template: Joi.string(),
    bank_logo: Joi.string().required(),
    bank_name: Joi.string().required(),
    bank_account_name: Joi.string().required(),
  });
  return schema.validate(data);
};
const validateCreateTransaction = (data) => {
  const schema = Joi.object({
    account_Bank_Id: Joi.number().required(),
    amount: Joi.number().required(),
    bank_Code_Name: Joi.string().required(),
    bank_Sub_Acc_Id: Joi.string().required(),
    cusum_Balance: Joi.number().required(),
    description: Joi.string().required(),
    tid: Joi.string().required(),
  });
  return schema.validate(data);
};
const validateCreateFeedBack = (data) => {
  const schema = Joi.object({
    product_id: Joi.string().required(),
    order_code: Joi.string().required(),
    content: Joi.string().required(),
    rating: Joi.number(),
  });
  return schema.validate(data);
};
const validateCreateDeliveryTrip = (data) => {
  const schema = Joi.object({
    account_id: Joi.string().required(),
    orders: Joi.array().required(),
  });
  return schema.validate(data);
};

module.exports = {
  validateEmail,
  validateUsername,
  validatePassword,
  validatePhoneNumber,
  validateCreateRoom,
  validateEditRoom,
  validateCreateAddress,
  validateCreateAccount,
  validateCreateProduct,
  validateCreateWareHouse,
  validateCreateSubType,
  validateVoucherInput,
  validateOrderInput,
  validateRegister,
  validateCreateDistrict,
  validateCreateFlashSale,
  validateUpdateFlashSale,
  validateCreateBankInfor,
  validateCreateTransaction,
  validateCreateFeedBack,
  validateCreateDeliveryTrip,
};
