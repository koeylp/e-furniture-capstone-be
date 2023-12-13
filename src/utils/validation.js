// src/utils/validation.js
const Joi = require("joi");

const validateEmail = (email) => {
  const schema = Joi.string().email().required();

  return schema.validate(email);
};

const validateUsername = (username) => {
  const schema = Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.alphanum': 'Username must only contain alphanumeric characters.',
      'string.min': 'Username must have at least {#limit} characters.',
      'string.max': 'Username cannot exceed {#limit} characters.',
    });

  return schema.validate(username);
};

const validatePassword = (password) => {
  const schema = Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit.",
    });

  return schema.validate(password);
};


module.exports = { validateEmail, validateUsername, validatePassword };
