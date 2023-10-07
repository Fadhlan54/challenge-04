// third-party package
const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// internal package
const adminRouter = require("./routes/adminRoutes");

const app = express();

// middleware
app.use(express.static(`${__dirname}/public`));
app.use(morgan("dev"));

// setting view engine
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: {
      maxAge: 6000,
    },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use((req, res, next) => {
  req.requestTime = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  req.date = `${req.requestTime.getDate()} ${
    months[req.requestTime.getMonth()]
  } ${req.requestTime.getFullYear()}`;

  next();
});

app.use("/", adminRouter);

app.use((req, res) => {
  res.status(404).send("404 not found");
});

module.exports = app;
