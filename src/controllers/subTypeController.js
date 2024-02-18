const SubTypeService = require("../services/subTypeService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const { validateCreateSubType } = require("../utils/validation");
class SubTypeController {
  static async getSubTypeDetail(req, res) {
    const { slug, type_slug } = req.params;
    if (!slug || !type_slug) throw new BadRequestError();
    return new OK({
      message: "SubType Detail!",
      metaData: await SubTypeService.getSubTypeDetail(slug, type_slug),
    }).send(res);
  }
  static async createSubType(req, res) {
    const { error } = validateCreateSubType(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    const { type_id, subType, description, thumb, attributes } = req.body;
    return new OK({
      message: "SubType Detail!",
      metaData: await SubTypeService.addSubType(
        type_id,
        subType,
        description,
        thumb,
        attributes
      ),
    }).send(res);
  }
  static async publishSubType(req, res) {
    const { type_slug, subType_slug } = req.params;
    if (!type_slug || !subType_slug) throw new BadRequestError();
    return new OK({
      message: "SubType Detail!",
      metaData: await SubTypeService.publishSubType(type_slug, subType_slug),
    }).send(res);
  }
  static async draftSubType(req, res) {
    const { type_slug, subType_slug } = req.params;
    if (!type_slug || !subType_slug) throw new BadRequestError();
    return new OK({
      message: "SubType Detail!",
      metaData: await SubTypeService.draftSubType(type_slug, subType_slug),
    }).send(res);
  }
}
module.exports = SubTypeController;
