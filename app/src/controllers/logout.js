const express = require("express");
const router = express.Router();

const { loginRequired } = require("../middleware");

router.get("/", loginRequired, function (req, res) {
  req.session.destroy(function () {
    res.redirect("/login/");
  });
});

module.exports = router;
