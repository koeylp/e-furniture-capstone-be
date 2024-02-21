const Joi = require("joi");
const { BadRequestError } = require("../../utils/errorHanlder");
const validateSubType = (data, subTypeEnum) => {
  const schema = Joi.object()
    .keys(
      subTypeEnum.reduce((acc, subType) => {
        const { name, type } = subType;
        const typeValidator = type === "string" ? Joi.string() : Joi.number();
        acc[name] = typeValidator.required();
        return acc;
      }, {})
    )
    .unknown(true);
  const result = schema.validate(data);
  if (result.error) throw new BadRequestError(result.error.details[0].message);
  return null;
};
module.exports = {
  validateSubType,
};
