const express = require("express");
const router = express.Router();

const db = require("../db");

const { loginRequired } = require("../middleware");

router.get("/", loginRequired, function (req, res) {
  db.query(
    "SELECT email, first_name, last_name FROM `app_user` WHERE id = ?",
    [req.session.user.id],
    function (error, results) {
      if (error) throw error;

      const user = results[0];

      res.render("my-account", { user });
    }
  );
});

module.exports = router;
