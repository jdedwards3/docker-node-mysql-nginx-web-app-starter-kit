const csurf = require("csurf");
const csrfProtection = csurf();

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

const middleware = { loginRequired, anonymous, csrfProtection };

module.exports = middleware;
