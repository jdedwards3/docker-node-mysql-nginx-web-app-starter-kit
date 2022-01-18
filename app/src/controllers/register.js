const express = require("express");
const router = express.Router();

const {
  anonymous,
  csrfProtection,
  validateEmail,
  validateStrongPasswordMatchesConfirmPassword,
} = require("../middleware");

const { RegisterViewModel } = require("../viewModels");

router.use(anonymous, csrfProtection);

router.get("/", function (req, res) {
  const registerViewModel = new RegisterViewModel({
    csrfToken: req.csrfToken(),
  });
  res.render("register", { registerViewModel });
});

router.post(
  "/",
  validateEmail,
  validateStrongPasswordMatchesConfirmPassword,
  function (req, res, next) {
    const registerViewModel = new RegisterViewModel({ email: req.body.email });

    registerViewModel.checkExistingUser(function (registerViewModel) {
      if (registerViewModel.id) {
        const registerViewModel = new RegisterViewModel({
          errors: [{ msg: "This email is already linked to an account." }],
          email: req.body.email,
          csrfToken: req.csrfToken(),
        });
        res.render("register", {
          registerViewModel,
        });
      } else {
        next();
      }
    });
  },
  function (req, res, next) {
    const registerViewModel = new RegisterViewModel({
      email: req.body.email,
      password: req.body.password,
    });

    registerViewModel.checkValidation(req);

    if (registerViewModel.errors) {
      res.render("register", { registerViewModel });
    } else {
      next();
    }
  },
  function (req, res) {
    const registerViewModel = new RegisterViewModel({
      email: req.body.email,
      password: req.body.password,
    });

    registerViewModel.registerUser(function (registerViewModel) {
      req.session.regenerate(function (error) {
        if (error) throw error;
        req.session.user = { id: registerViewModel.id };
        res.redirect("/");
      });
    });
  }
);

module.exports = router;
