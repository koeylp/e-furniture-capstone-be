const TypeService = require("../services/typeService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
class TypeController {
  static async createType(req, res) {
    const { name, thumb } = req.body;
    if (!name || !thumb) throw new BadRequestError();
    return new OK({
      message: "Create Successfully!",
      metaData: await TypeService.createType(name, thumb),
    }).send(res);
  }
  static async publishType(req, res) {
    const { type_slug } = req.params;
    if (!type_slug) throw new BadRequestError();
    return new OK({
      message: "Publish SubType Successfully!",
      metaData: await TypeService.publishType(type_slug),
    }).send(res);
  }
  static async draftType(req, res) {
    const { type_slug } = req.params;
    if (!type_slug) throw new BadRequestError();
    return new OK({
      message: "Draft SubType Successfully!",
      metaData: await TypeService.draftType(type_slug),
    }).send(res);
  }
  static async getAllType(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getTypes(page, limit),
    }).send(res);
  }
  static async getSubType(req, res) {
    const { type_slug } = req.params;
    if (!type_slug) throw new BadRequestError();
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getSubTypeByType(type_slug),
    }).send(res);
  }
  static async getSubTypeByTypeStaff(req, res) {
    const { type_slug } = req.params;
    if (!type_slug) throw new BadRequestError();
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getSubTypeByTypeStaff(type_slug),
    }).send(res);
  }
  static async removeType(req, res) {
    const { type_slug } = req.params;
    if (!type_slug) throw new BadRequestError();
    return new OK({
      message: "Remove Type Successfully!",
      metaData: await TypeService.removeType(type_slug),
    }).send(res);
  }
  static async getPublishedType(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getPublishedType(page, limit),
    }).send(res);
  }
  static async getDraftType(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getUnPublishedType(page, limit),
    }).send(res);
  }
}
module.exports = TypeController;
