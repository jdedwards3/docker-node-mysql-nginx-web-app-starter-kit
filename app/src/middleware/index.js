const csurf = require("csurf");
const csrfProtection = csurf();
const { body } = require("express-validator");

function loginRequired(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login/");
  }
}

function anonymous(req, res, next) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
  }
}

const validateStrongPasswordMatchesConfirmPassword = body("password")
  .notEmpty()
  .withMessage("Password is required.")
  .isStrongPassword()
  .withMessage(
    "Password must be at least 8 characters and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."
  )
  .custom(function (value, { req }) {
    if (value !== req.body.confirm_password) {
      throw new Error("Password and Confirm Password must match.");
    } else {
      return value;
    }
  })
  .withMessage("Password does not match Confirm Password.");

const validateEmail = body("email")
  .notEmpty()
  .withMessage("Email is required.")
  .isEmail()
  .withMessage("Email is formatted incorrectly.")
  .normalizeEmail({
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  });

const validatePassword = body("password")
  .notEmpty()
  .withMessage("Password is required.");

const middleware = {
  loginRequired,
  anonymous,
  csrfProtection,
  validateStrongPasswordMatchesConfirmPassword,
  validateEmail,
  validatePassword,
};

module.exports = middleware;
