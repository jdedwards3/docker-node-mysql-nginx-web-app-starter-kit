const express = require("express");
const router = express.Router();
const { pbkdf2, randomBytes } = require("crypto");
const { body, validationResult } = require("express-validator");

const db = require("../db");

const { anonymous, csrfProtection } = require("../middleware");

router.get("/", anonymous, csrfProtection, function (req, res) {
  res.render("register", { csrfToken: req.csrfToken() });
});

router.post(
  "/",
  anonymous,
  csrfProtection,
  body("email")
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
    }),
  body("password")
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
    .withMessage("Password does not match Confirm Password."),
  function (req, res, next) {
    db.query(
      "SELECT email FROM `app_user` where email = ?",
      [req.body.email],
      function (err, results) {
        if (err) throw err;
        if (results.length > 0) {
          res.render("register", {
            errors: [{ msg: "This email is already linked to an account." }],
            user: req.body,
            csrfToken: req.csrfToken(),
          });
        } else {
          next();
        }
      }
    );
  },
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.body.email === "@") {
        req.body.email = "";
      }
      res.render("register", {
        errors: errors.array(),
        user: req.body,
        csrfToken: req.csrfToken(),
      });
    } else {
      next();
    }
  },
  function (req, res) {
    randomBytes(64, function (err, buff) {
      if (err) throw err;

      const salt = buff.toString("hex");

      pbkdf2(
        req.body.password,
        salt,
        100000,
        64,
        "sha512",
        (err, derivedKey) => {
          if (err) throw err;

          const hash = derivedKey.toString("hex");

          db.query(
            "INSERT INTO `app_user` (email, salt, hash) VALUES (?,?,?)",
            [req.body.email, salt, hash],
            function (error, results) {
              if (error) throw error;
              const userId = results.insertId;
              req.session.regenerate(function (err) {
                if (err) throw err;
                req.session.user = { id: userId };
                res.redirect("/");
              });
            }
          );
        }
      );
    });
  }
);

module.exports = router;
