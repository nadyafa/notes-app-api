const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  // adding a token
  async addRefreshToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };

    await this._pool.query(query);
  }

  // re-verify fresh token
  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  // delete token from DB
  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
