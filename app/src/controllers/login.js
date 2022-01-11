const express = require("express");
const router = express.Router();
const { pbkdf2 } = require("crypto");
const { body, validationResult } = require("express-validator");

const db = require("../db");

const { anonymous, csrfProtection } = require("../middleware");

router.get("/", anonymous, csrfProtection, function (req, res) {
  res.render("login", { csrfToken: req.csrfToken() });
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
  body("password").notEmpty().withMessage("Password is required."),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.body.email === "@") {
        req.body.email = "";
      }
      res.render("login", {
        errors: errors.array(),
        user: req.body,
        csrfToken: req.csrfToken(),
      });
    } else {
      next();
    }
  },
  function (req, res) {
    db.query(
      "SELECT id, salt, hash FROM `app_user` WHERE email = ?",
      [req.body.email],
      function (error, results) {
        if (error) throw error;

        const user = results[0];

        if (user) {
          pbkdf2(
            req.body.password,
            user.salt,
            100000,
            64,
            "sha512",
            (err, derivedKey) => {
              if (err) throw err;

              const hash = derivedKey.toString("hex");

              if (hash === user.hash) {
                req.session.regenerate(function (err) {
                  if (err) throw err;
                  req.session.user = { id: user.id };
                  res.redirect("/");
                });
              } else {
                res.render("login", {
                  errors: [{ msg: "Email or Password is incorrect." }],
                  user: req.body,
                  csrfToken: req.csrfToken(),
                });
              }
            }
          );
        } else {
          res.render("login", {
            errors: [{ msg: "Email or Password is incorrect." }],
            user: req.body,
            csrfToken: req.csrfToken(),
          });
        }
      }
    );
  }
);

module.exports = router;
