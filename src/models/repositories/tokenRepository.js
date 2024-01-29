const { default: mongoose } = require("mongoose");
const { checkValidId } = require("../../utils");
const _Token = require("../tokenModel");

class TokenRepository {
  static async insertOrUpdate(account_id, refresh_token, public_key) {
    const tokenCheck = await this.findTokenByAccountId(account_id);
    let query = { account_id: new mongoose.Types.ObjectId(account_id) };
    let update = {
      $set: {
        public_key: public_key.toString(),
        refresh_token,
      },
      $push: {
        token_used: tokenCheck ? tokenCheck.refresh_token : [],
      },
    };
    let options = { upsert: true, new: true };
    return await _Token.updateOne(query, update, options);
  }
  static async findTokenByAccountId(account_id) {
    checkValidId(account_id);
    let query = { account_id: new mongoose.Types.ObjectId(account_id) };
    return await _Token.findOne(query).lean();
  }
  static async removeToken(account_id) {
    checkValidId(account_id);
    let query = {
      account_id: new mongoose.Types.ObjectId(account_id),
    };
    return await _Token.deleteOne(query);
  }
}
module.exports = TokenRepository;
