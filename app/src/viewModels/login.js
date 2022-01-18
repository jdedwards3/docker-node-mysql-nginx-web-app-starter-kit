const { validationResult } = require("express-validator");

const { UserModel } = require("../models");

class LoginViewModel {
  constructor(init = {}) {
    Object.assign(this, init);
  }

  // todo: base
  build(cb) {
    const user = new UserModel({ email: this.email });
    user.read(
      [user.columns().id, user.columns().salt, user.columns().hash],
      (user) => {
        cb(Object.assign(this, user));
      }
    );
  }

  verifyPassword(cb) {
    if (this.salt && this.hash && this.password) {
      const user = new UserModel({
        salt: this.salt,
      });
      user.hashPassword(this.password, (hash) => {
        cb(this.hash === hash);
      });
    } else {
      cb(false);
    }
  }

  // todo: base
  checkValidation(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      this.errors = errors.array();
      this.csrfToken = req.csrfToken();
    }
  }
}

module.exports = LoginViewModel;
