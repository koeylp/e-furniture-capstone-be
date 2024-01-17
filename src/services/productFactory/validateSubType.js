const Joi = require("joi");
const { BadRequestError } = require("../../utils/errorHanlder");
const validateSubType = (data, subTypeEnum) => {
  const schema = Joi.object().keys(
    Object.keys(subTypeEnum).reduce((acc, subType) => {
      const typeValidator =
        subTypeEnum[subType] === "string" ? Joi.string() : Joi.number();
      acc[subType] = typeValidator.required();
      return acc;
    }, {})
  );
  const result = schema.validate(data);
  if (result.error) throw new BadRequestError(result.error.details[0].message);
  return null;
};
module.exports = {
  validateSubType,
};
