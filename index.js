const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const expresslayout = require("express-ejs-layouts");

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
  res.render("index");
});

// User routes
app.get("/register", (req, res) => {
  res.render("user/register");
});

app.get("/login", (req, res) => {
  res.render("user/login");
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}..`);
});
