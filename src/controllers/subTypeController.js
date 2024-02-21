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
    return new OK({
      message: "Create SubType Successfully!",
      metaData: await SubTypeService.addSubType(req.body),
    }).send(res);
  }
  static async publishSubType(req, res) {
    const { type_slug, subType_slug } = req.params;
    if (!type_slug || !subType_slug) throw new BadRequestError();
    return new OK({
      message: "Publish SubType Successfully!",
      metaData: await SubTypeService.publishSubType(type_slug, subType_slug),
    }).send(res);
  }
  static async draftSubType(req, res) {
    const { type_slug, subType_slug } = req.params;
    if (!type_slug || !subType_slug) throw new BadRequestError();
    return new OK({
      message: "Draft SubType Successfully!",
      metaData: await SubTypeService.draftSubType(type_slug, subType_slug),
    }).send(res);
  }
  static async removeSubType(req, res) {
    const { type_slug, subType_slug } = req.params;
    if (!type_slug || !subType_slug) throw new BadRequestError();
    return new OK({
      message: "Remove Subtype Successfully!",
      metaData: await SubTypeService.removeSubType(type_slug, subType_slug),
    }).send(res);
  }
  static async getDraftSubType(req, res) {
    return new OK({
      message: "List Of Draft SubType!",
      metaData: await SubTypeService.getDrafSubTypes(),
    }).send(res);
  }
  static async getPublishSubType(req, res) {
    return new OK({
      message: "List Of Publish SubType!",
      metaData: await SubTypeService.getPublishSubTypes(),
    }).send(res);
  }
  static async getAllSubType(req, res) {
    return new OK({
      message: "List Of SubType!",
      metaData: await SubTypeService.getAll(),
    }).send(res);
  }
}
module.exports = SubTypeController;
