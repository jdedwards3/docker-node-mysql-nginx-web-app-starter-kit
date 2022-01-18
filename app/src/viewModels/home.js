const { UserModel } = require("../models");

class HomeViewModel {
  constructor(init = {}) {
    Object.assign(this, init);
  }

  build = (cb) => {
    new UserModel({ id: this.userId }).read(["email"], (user) => {
      cb(Object.assign(this, user));
    });
  };
}

module.exports = HomeViewModel;
