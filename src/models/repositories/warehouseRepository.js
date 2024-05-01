const _WareHouse = require("../warehouseModel");
const { checkValidId, getUnSelectData } = require("../../utils/index");
const { default: mongoose } = require("mongoose");
const { InternalServerError } = require("../../utils/errorHanlder");
class WareHouseRepository {
  static async createWareHouse(payload) {
    const warehouse = await _WareHouse.create({
      street: payload.street,
      district: payload.district,
      ward: payload.ward,
      province: payload.province,
      longitude: payload.longitude,
      latitude: payload.latitude,
      location: payload.location,
      stock: payload.stock,
    });
    if (!warehouse) throw new InternalServerError();
    return warehouse;
  }
  static async getWareHouse(page, limit) {
    const skip = (page - 1) * limit;
    return await _WareHouse.find().skip(skip).limit(limit).lean().exec();
  }
  static async getWareHouseByQuery(query, option = []) {
    return await _WareHouse
      .find(query)
      .select(getUnSelectData(option))
      .lean()
      .exec();
  }
  static async getWareHouseByArrayId(array) {
    const query = {
      _id: {
        $in: array.map((id) => new mongoose.Types.ObjectId(id.warehouse_id)),
      },
    };
    const option = [
      "products",
      "is_draft",
      "is_published",
      "createdAt",
      "updatedAt",
      "__v",
    ];
    return await this.getWareHouseByQuery(query, option);
  }
  static async getWareHouseByIDWithOptions(warehouse_id) {
    const query = {
      _id: new mongoose.Types.ObjectId(warehouse_id),
    };
    const option = [
      "products",
      "is_draft",
      "is_published",
      "createdAt",
      "updatedAt",
      "__v",
    ];
    return await this.getWareHouseByQuery(query, option);
  }

  static async findWareHouseByProduct(product_id) {
    checkValidId(product_id);
    const query = {
      product_id: new mongoose.Types.ObjectId(product_id),
    };
    return await _WareHouse.findOne(query).lean();
  }
  static async findWareHouseById(warehouse_id) {
    checkValidId(warehouse_id);
    const query = {
      _id: new mongoose.Types.ObjectId(warehouse_id),
    };
    const result = await _WareHouse
      .findOne(query)
      .populate("products.product")
      .lean();
    const productFilter = result.products.filter(
      (product) => product.is_published === true
    );
    result.products = productFilter;
    return result;
  }
  static async updateWareHouse(warehouse_id, update) {
    checkValidId(warehouse_id);
    const query = {
      _id: new mongoose.Types.ObjectId(warehouse_id),
    };
    const option = { new: true };
    return await _WareHouse.findOneAndUpdate(query, update, option);
  }
  static async removeWareHouse(warehouse_id) {
    checkValidId(warehouse_id);
    const query = {
      _id: new mongoose.Types.ObjectId(warehouse_id),
    };
    return await _WareHouse.deleteOne(query);
  }
  static async findByQuery(query) {
    return await _WareHouse.findOne(query).exec();
  }
  static async findFirst() {
    const result = await _WareHouse
      .findOne()
      .populate("products.product")
      .lean();
    const productFilter = result.products.filter(
      (product) => product.is_published === true && product.product !== null
    );
    result.products = productFilter;
    return result;
  }
  static async save(warehouse) {
    return await _WareHouse.updateOne({ _id: warehouse._id }, warehouse);
  }
  static async findManyByQuery(product_id, quantity) {
    const query = {
      products: {
        $elemMatch: {
          product: new mongoose.Types.ObjectId(product_id),
          stock: { $gte: quantity },
        },
      },
      is_draft: false,
      is_published: true,
    };
    return await _WareHouse.find(query).exec();
  }
  static async findManyByProductCode(code, quantity) {
    const query = {
      products: {
        $elemMatch: {
          code: code,
          stock: { $gte: quantity },
        },
      },
      is_draft: false,
      is_published: true,
    };
    return await _WareHouse.find(query).exec();
  }
  static async updateProductStatus({ warehouse, product_id, is_draft }) {
    for (let index = 0; index < warehouse.products.length; index++) {
      if (
        warehouse.products[index].product.equals(
          new mongoose.Types.ObjectId(product_id)
        )
      ) {
        warehouse.products[index].is_draft = is_draft;
        warehouse.products[index].is_published = !is_draft;
      }
    }
    await this.save(warehouse);
  }
  static async deleteProduct({ warehouse, product_id }) {
    let products = [];
    for (let index = 0; index < warehouse.products.length; index++) {
      if (
        !warehouse.products[index].product.equals(
          new mongoose.Types.ObjectId(product_id)
        )
      ) {
        products.push(warehouse.products[index]);
      }
    }
    warehouse.products = products;
    await this.save(warehouse);
  }
  static async draftProductInsideWareHouse(product_id) {
    _WareHouse
      .find({
        "products.product": { $eq: new mongoose.Types.ObjectId(product_id) },
      })
      .then(async (warehouses) => {
        if (warehouses.length < 0) return;
        await Promise.all(
          warehouses.map(async (warehouse) =>
            this.updateProductStatus({ warehouse, product_id, isDraft: true })
          )
        );
      });
  }
  static async publishProductInsideWareHouse(product_id) {
    _WareHouse
      .find({
        "products.product": { $eq: new mongoose.Types.ObjectId(product_id) },
      })
      .then(async (warehouses) => {
        if (warehouses.length < 0) return;
        await Promise.all(
          warehouses.map(async (warehouse) =>
            this.updateProductStatus({
              warehouse,
              product_id,
              isDraft: false,
            })
          )
        );
      });
  }
  static async deleteProductInsideWareHouse(product_id) {
    _WareHouse
      .find({
        "products.product": { $eq: new mongoose.Types.ObjectId(product_id) },
      })
      .then(async (warehouses) => {
        if (warehouses.length < 0) return;
        await Promise.all(
          warehouses.map(async (warehouse) =>
            this.deleteProduct({
              warehouse,
              product_id,
            })
          )
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
module.exports = WareHouseRepository;
