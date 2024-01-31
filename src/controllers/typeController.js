const TypeService = require("../services/typeService");
const SubTypeService = require("../services/subTypeService");
const { BadRequestError } = require("../utils/errorHanlder");
const { OK } = require("../utils/successHandler");
class TypeController {
  static async createType(req, res) {
    const { name } = req.body;
    if (!name) throw new BadRequestError();
    return new OK({
      message: "Create Successfully!",
      metaData: await TypeService.createType(name),
    }).send(res);
  }
  static async addSubType(req, res) {
    const { type_id } = req.params;
    const { subType, description, thumb, attributes } = req.body;
    if (!subType || !description || !thumb || !attributes)
      throw new BadRequestError();
    return new OK({
      message: "Create SubType Successfully!",
      metaData: await TypeService.addSubType(
        type_id,
        subType,
        description,
        thumb,
        attributes
      ),
    }).send(res);
  }
  static async getAllType(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getTypes(page, limit),
    }).send(res);
  }
  static async getPublishedType(req, res) {
    const { page, limit } = req.query;
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getPublishedType(page, limit),
    }).send(res);
  }
  static async getSubType(req, res) {
    const { type_id } = req.params;
    return new OK({
      message: "List Of Type!",
      metaData: await TypeService.getSubTypeByType(type_id),
    }).send(res);
  }
}
module.exports = TypeController;
