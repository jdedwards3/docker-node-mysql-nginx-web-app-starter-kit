const loginController = require("./login");
const registerController = require("./register");
const myAccountController = require("./my-account");
const updateMyAccountController = require("./update-my-account");

const controllers = {
  loginController,
  registerController,
  myAccountController,
  updateMyAccountController,
};

module.exports = controllers;
