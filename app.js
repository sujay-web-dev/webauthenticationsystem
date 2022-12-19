require("dotenv").config();
const express = require("express");

const User = require("./model/user");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System - WEB 3 </h1>");
});

app.get("/register", (req, res) => {
  const { firstname, lastname, email, passowrd } = req.body;

  if (!(email && passowrd && firstname && lastname)) {
    res.status(400).send("All fields are required");
  }

  const existingUser = User.findOne({ email });

  if (existingUser) {
    res.status(401).send("User Already Exists");
  }

  res.status(400).send("All fields are required");
});

module.exports = app;
