// const aws = require("aws-sdk");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const { connection } = require("./db");
const sessionStore = new MySQLStore({}, connection);

const {
  homeController,
  loginController,
  registerController,
  myAccountController,
  updateMyAccountController,
  logoutController,
} = require("./controllers");

const app = express();

app.set("strict routing", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: false }));

app.use(helmet());

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    name: process.env.EXPRESS_SESSION_NAME,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000,
      httpOnly: true,
      secure: true,
    },
    rolling: true,
  })
);

app.use("/", homeController);

app.use("/login", loginController);

app.use("/register", registerController);

app.use("/my-account", myAccountController);

app.use("/update-my-account", updateMyAccountController);

app.use("/logout", logoutController);

app.use(function (req, res) {
  res.status(404);
  res.render("404");
});

app.use(function (error, req, res, next) {
  if (process.env.NODE_ENV === "development") {
    console.error(error.stack);
  }
  res.status(500);
  res.render("500");
});

app.listen(process.env.PORT);
