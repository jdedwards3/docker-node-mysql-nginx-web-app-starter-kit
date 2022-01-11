const db = require("../db");

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
  create() {}
  read(cb) {
    db.query(
      "SELECT * FROM app_user WHERE id = ?",
      [this.id],
      function (err, results) {
        if (err) throw err;
        cb(results[0]);
      }
    );
  }
  update() {}
  delete() {}
}

module.exports = UserModel;
