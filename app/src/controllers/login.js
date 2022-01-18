const express = require("express");
const router = express.Router();

const {
  anonymous,
  csrfProtection,
  validateEmail,
  validatePassword,
} = require("../middleware");

const { LoginViewModel } = require("../viewModels");

router.use(anonymous, csrfProtection);

router.get("/", function (req, res) {
  const loginViewModel = new LoginViewModel({ csrfToken: req.csrfToken() });
  res.render("login", { loginViewModel });
});

router.post(
  "/",
  validateEmail,
  validatePassword,
  function (req, res, next) {
    const loginViewModel = new LoginViewModel({
      email: req.body.email,
      password: req.body.password,
    });

    loginViewModel.checkValidation(req);

    if (loginViewModel.errors) {
      res.render("login", { loginViewModel });
    } else {
      next();
    }
  },
  function (req, res) {
    const loginViewModel = new LoginViewModel({
      email: req.body.email,
      password: req.body.password,
    });

    loginViewModel.build(function (loginViewModel) {
      loginViewModel.verifyPassword(function (result) {
        if (result) {
          req.session.regenerate(function (error) {
            if (error) throw error;
            req.session.user = { id: loginViewModel.id };
            res.redirect("/");
          });
        } else {
          loginViewModel = new LoginViewModel({
            errors: [{ msg: "Email or Password is incorrect." }],
            email: loginViewModel.email,
            csrfToken: req.csrfToken(),
          });
          res.render("login", {
            loginViewModel,
          });
        }
      });
    });
  }
);

module.exports = router;
