const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const db = require("../db");

const { loginRequired, csrfProtection } = require("../middleware");

router.get("/", loginRequired, csrfProtection, function (req, res) {
  db.query(
    "SELECT email, first_name, last_name FROM `app_user` where id = ?",
    [req.session.user.id],
    function (error, results) {
      if (error) throw error;
      const user = results[0];
      res.render("update-my-account", { csrfToken: req.csrfToken(), user });
    }
  );
});

router.post(
  "/",
  loginRequired,
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
  body("first_name")
    .notEmpty()
    .withMessage("First Name is required.")
    .isAlpha()
    .withMessage("First Name must contain only letters.")
    .trim()
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Last Name is required.")
    .isAlpha()
    .withMessage("Last Name must contain only letters.")
    .trim()
    .escape(),
  function (req, res, next) {
    db.query(
      "SELECT id FROM `app_user` WHERE email = ? LIMIT 1",
      [req.body.email],
      function (error, results) {
        if (error) throw error;
        if (results.length > 0 && results[0].id !== req.session.user.id) {
          res.render("update-my-account", {
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
      res.render("update-my-account", {
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
      "UPDATE `app_user` SET email = ?, first_name = ?, last_name = ? WHERE id = ?",
      [
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.session.user.id,
      ],
      function (error) {
        if (error) throw error;
        res.redirect("/my-account/");
      }
    );
  }
);

module.exports = router;
