const homeController = require("./home");
const loginController = require("./login");
const registerController = require("./register");
const myAccountController = require("./my-account");
const updateMyAccountController = require("./update-my-account");
const logoutController = require("./logout");

const controllers = {
  homeController,
  loginController,
  registerController,
  myAccountController,
  updateMyAccountController,
  logoutController,
};

module.exports = controllers;
