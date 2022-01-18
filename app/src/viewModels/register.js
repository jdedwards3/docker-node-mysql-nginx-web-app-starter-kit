const { validationResult } = require("express-validator");
const { UserModel } = require("../models");

class RegisterViewModel {
  constructor(init = {}) {
    Object.assign(this, init);
  }

  registerUser(cb) {
    if (this.password) {
      const user = new UserModel({
        email: this.email,
      });
      user.create(this.password, (user) => {
        cb(Object.assign(this, user));
      });
    }
  }

  checkExistingUser(cb) {
    const user = new UserModel({ email: this.email });
    user.read([user.columns().id], (user) => {
      cb(Object.assign(this, user));
    });
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

module.exports = RegisterViewModel;
