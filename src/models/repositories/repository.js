const {
  getSelectData,
  getUnSelectData,
  removeUndefineObject,
} = require("../../utils/index");
const { NotFoundError } = require("../../utils/errorHanlder");

class Repository {
  static async exist({ query, MODEL }) {
    return await MODEL.findOne(query).lean();
  }
  static async findOne({ query, filter = [], MODEL }) {
    const result = await MODEL.findOne(query)
      .select(getSelectData(filter))
      .lean();
    if (!result) throw new NotFoundError("Cannot Find Any Result!");
    return result;
  }
  static async findOneUnSelected({ query, filter = [], MODEL }) {
    const result = await MODEL.findOne(query)
      .select(getUnSelectData(filter))
      .lean();
    if (!result) throw new NotFoundError("Cannot Find Any Result!");
    return result;
  }
  static async getAll({
    limit = 50,
    sort = "ctime",
    page = 1,
    query = {},
    filter = [],
    MODEL,
  }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: 1 } : sort;
    return await MODEL.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(filter))
      .lean();
  }
  static async update({ query, update, options = { new: isTrue }, MODEL }) {
    const result = await MODEL.findOneAndUpdate(query, update, options);
    if (!result) throw new NotFoundError("Cannot Update Any Result!");
    return result;
  }
  static async updateMany({ query, update, isTrue = true, MODEL }) {
    const objectParam = removeUndefineObject(update);
    const result = await MODEL.updateMany(
      query,
      { $set: objectParam },
      { new: isTrue }
    );
    if (!result) throw new NotFoundError("Cannot Update Any Result!");
    return result;
  }
  static async searchByText({ keySearch, filter = [], MODEL, options = {} }) {
    const searchValue =
      typeof keySearch === "object" ? keySearch.text : keySearch;
    const regexSearch = new RegExp(searchValue);
    const result = await MODEL.find(
      { $text: { $search: regexSearch }, ...options },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .select(getSelectData(filter))
      .lean();
    return result;
  }
  static async removeOne({ query, MODEL }) {
    return await MODEL.deleteOne(query);
  }
  static async add({ query, MODEL }) {
    return await MODEL.create(query);
  }
}

module.exports = Repository;
