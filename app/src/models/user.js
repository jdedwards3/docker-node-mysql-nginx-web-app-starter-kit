const { knex } = require("../db");
const { randomBytes, pbkdf2 } = require("crypto");

class UserModel {
  constructor(
    init = {
      id,
      email,
      salt,
      hash,
      firstName,
      lastName,
      forgotPasswordSalt,
      forgotPasswordHash,
      forgotPasswordTokenEnd,
      createdAt,
      updatedAt,
    }
  ) {
    Object.assign(this, init);
  }

  hashPassword(password, cb) {
    pbkdf2(password, this.salt, 100000, 64, "sha512", (error, derivedKey) => {
      if (error) throw error;
      cb(derivedKey.toString("hex"));
    });
  }

  // todo: base
  create(password, cb) {
    randomBytes(64, (error, buff) => {
      if (error) throw error;

      this.salt = buff.toString("hex");

      this.hashPassword(password, (hash) => {
        this.hash = hash;

        knex("app_user")
          .insert(this)
          .then((result) => {
            cb({ id: result[0] });
          });
      });
    });
  }
  // todo: base
  read(columns, cb) {
    knex("app_user")
      .where(this)
      .select(columns)
      .first()
      .then(function (user) {
        cb(user);
      });
  }
  // todo: base
  update() {}
  // todo: base
  delete() {}
  // todo: base
  columns() {
    return {
      id: "id",
      email: "email",
      salt: "salt",
      hash: "hash",
      firstName: "first_name",
      lastName: "last_name",
      forgotPasswordSalt: "forgot_password_salt",
      forgotPasswordHash: "forgot_password_hash",
      forgotPasswordTokenEnd: "forgot_password_token_end",
      createdAt: "created_at",
      updatedAt: "updated_at",
    };
  }
}

module.exports = UserModel;
