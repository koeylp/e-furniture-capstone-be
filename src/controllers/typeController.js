const TypeService = require("../services/typeService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
const NotificationEfurnitureService = require("../services/NotificationEfurnitureService");
class TypeController {
  static async createType(req, res) {
    const { name, thumb } = req.body;
    const { account_id } = req.payload;
    if (!name || !thumb) throw new BadRequestError();
    const type = await TypeService.createType(name, thumb);
    await NotificationEfurnitureService.notiToAdmin(
      account_id,
      "Type",
      type.name,
      "Created"
    );
    return new OK({
      message: "Create Successfully!",
      metaData: type,
    }).send(res);
  }
  static async publishType(req, res) {
    const { type_slug } = req.params;
    if (!type_slug) throw new BadRequestError();
    const { account_id } = req.payload;
    let type = await TypeService.publishType(type_slug);
    await NotificationEfurnitureService.notiToAdmin(
      account_id,
      "Type",
      type.name,
      "Published"
    );
    return new OK({
      message: "Publish SubType Successfully!",
      metaData: type,
    }).send(res);
  }
  static async draftType(req, res) {
    const { type_slug } = req.params;
    if (!type_slug) throw new BadRequestError();
    const { account_id } = req.payload;
    let type = await TypeService.draftType(type_slug);
    await NotificationEfurnitureService.notiToAdmin(
      account_id,
      "Type",
      type.name,
      "Draft"
    );
    return new OK({
      message: "Draft SubType Successfully!",
      metaData: type,
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
  static async getTypeDetail(req, res) {
    const { type } = req.params;
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.findType(type),
    }).send(res);
  }
}
module.exports = TypeController;
