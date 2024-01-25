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
    status: Joi.number(),
  });
  return schema.validate(data);
};
const validateEditRoom = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20),
    description: Joi.string().min(3),
    thumb: Joi.string().min(3),
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
const validateCreateAccount = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    confirm_password: Joi.string().required(),
    full_name: Joi.string().required(),
    avatar: Joi.string(),
    status: Joi.number(),
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
};
