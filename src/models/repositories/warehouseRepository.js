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
  static async draftProductInsideWareHouse(product_id) {
    _WareHouse
      .find({
        "products.product": { $eq: new mongoose.Types.ObjectId(product_id) },
      })
      .then((warehouses) => {
        if (warehouses.length > 0) {
          warehouses.forEach((warehouse) => {
            const productIndex = warehouse.products.findIndex((product) =>
              product.product.equals(new mongoose.Types.ObjectId(product_id))
            );
            if (productIndex !== -1) {
              warehouse.products[productIndex].is_draft = true;
              warehouse.products[productIndex].is_published = false;
            }
          });
          Promise.all(warehouses.map((warehouse) => warehouse.save())).catch(
            (error) => console.error(error)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  static async publishProductInsideWareHouse(product_id) {
    _WareHouse
      .find({
        "products.product": { $eq: new mongoose.Types.ObjectId(product_id) },
      })
      .then((warehouses) => {
        if (warehouses.length > 0) {
          warehouses.forEach((warehouse) => {
            const productIndex = warehouse.products.findIndex((product) =>
              product.product.equals(new mongoose.Types.ObjectId(product_id))
            );
            if (productIndex !== -1) {
              warehouse.products[productIndex].is_draft = false;
              warehouse.products[productIndex].is_published = true;
            }
          });
          Promise.all(warehouses.map((warehouse) => warehouse.save())).catch(
            (error) => console.error(error)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  static async deleteProductInsideWareHouse(product_id) {
    _WareHouse
      .find({
        "products.product": { $eq: new mongoose.Types.ObjectId(product_id) },
      })
      .then((warehouses) => {
        if (warehouses.length > 0) {
          warehouses.forEach((warehouse) => {
            const productIndex = warehouse.products.findIndex((product) =>
              product.product.equals(new mongoose.Types.ObjectId(product_id))
            );
            warehouse.products.splice(productIndex, 1);
          });
          Promise.all(warehouses.map((warehouse) => warehouse.save())).catch(
            (error) => console.error(error)
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
module.exports = WareHouseRepository;
