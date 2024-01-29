const { ConflictRequestError } = require("../utils/errorHanlder");
const TokenRepository = require("../models/repositories/tokenRepository");
class TokenService {
  static async createTokenContain({ account_id, public_key, refresh_token }) {
    return await TokenRepository.insertOrUpdate(
      account_id,
      refresh_token,
      public_key
    );
  }
  static async findToken({ account_id, refresh_token }) {
    const token = await TokenRepository.findTokenByAccountId(account_id);
    if (!token) return null;
    const checkUsed = token.token_used.some((used) => used === refresh_token);
    if (checkUsed) throw new ConflictRequestError();
    return token;
  }
  static async deleteToken(account_id) {
    return await TokenRepository.removeToken(account_id);
  }
}
module.exports = TokenService;
