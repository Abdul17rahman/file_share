const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const expresslayout = require("express-ejs-layouts");
const bcrypt = require("bcrypt");
const User = require("./model/user.model");
const nodemailer = require("nodemailer");

const PORT = 3000;

// Setup mongodb.
mongoose
  .connect("mongodb://127.0.0.1:27017/fileShare")
  .then(() => {
    console.log("Database connected.!");
  })
  .catch((err) => {
    console.log(err);
  });

// Use session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Set up nodemailer
// const nodemailerFrom = "abdulnsamba@gmail.com";
// const nodemailerObject = {
//   service: "gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "abdulnsamba@gmail.com",
//     password: "",
//   },
// };

// Accept form data
app.use(express.urlencoded({ extended: true }));

// Middleware for using for session
app.use((req, res, next) => {
  // (req.mainUrl = mainUrl),
  req.isLogin = typeof req.session.user !== "undefined";
  req.user = req.session.user;
  next();
});

// Set public assets folder
app.use(express.static(path.join(__dirname, "public")));

// Use layouts
app.use(expresslayout);

// Use layout
app.set("layout", "partials/boilerPlate");

// Set templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Base route
app.get("/", (req, res) => {
  res.render("index", { req });
});

// User routes
app.get("/register", (req, res) => {
  res.render("user/register", { req });
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const checkUser = await User.findOne({ email: email });

  if (checkUser) {
    return res.status(404).json({
      error: "User already exits.",
    });
  }

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashed,
    veri_token: new Date().getTime(),
  });

  // const transporter = nodemailer.createTransport(nodemailerObject)
  // const text = "Please verify"

  newUser.save();
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  // console.log(req.session.user);
  res.render("user/login", { req });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email: email });

  if (!foundUser) {
    return res.status(404).json({
      error: "Invalid credentials.",
    });
  }

  const verified = await bcrypt.compare(password, foundUser.password);

  if (verified) {
    console.log(foundUser);
    req.session.user = foundUser;
    res.redirect("/");
  } else {
    return res.status(404).json({
      error: "Invalid credentials.",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  // req.session.user = undefined;
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}..`);
});
