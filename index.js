const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const expresslayout = require("express-ejs-layouts");
const bcrypt = require("bcrypt");

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

// Accept form data
app.use(express.urlencoded({ extended: true }));

// Set public assets folder
app.use(express.static(path.join(__dirname, "public")));

// Use layouts
app.use(expresslayout);

// Use layout
app.set("layout", "partials/boilerPlate");

// Set templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Middleware for using for session
app.use((req, res, next) => [
  (req.mainUrl = mainUrl),
  (req.isLogin = typeof req.session.user !== "undefined"),
  (req.user = req.session.user),
  next(),
]);

// Base route
app.get("/", (req, res) => {
  res.render("index");
});

// User routes
app.get("/register", (req, res) => {
  res.render("user/register");
});

app.post("/register", (req, res) => {
  console.log(req.body);
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("user/login");
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}..`);
});
