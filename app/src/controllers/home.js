const express = require("express");
const router = express.Router();

const { loginRequired } = require("../middleware");

const { HomeViewModel } = require("../viewModels");

router.get("/", loginRequired, function (req, res) {
  new HomeViewModel({ userId: req.session.user.id }).build(function (
    homeViewModel
  ) {
    res.render("home", { homeViewModel });
  });
});

module.exports = router;
