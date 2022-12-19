require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("./model/user");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System - WEB 3 </h1>");
});

app.get("/register", async (req, res) => {
  const { firstname, lastname, email, passowrd } = req.body;

  if (!(email && passowrd && firstname && lastname)) {
    res.status(400).send("All fields are required");
  }

  const existingUser = await User.findOne({ email }); //PROMISE

  if (existingUser) {
    res.status(401).send("User Already Exists");
  }

  const myEncPassword = await bcrypt.hash(passowrd, 10);

  const user = await User.create({
    firtsname,
    lastname,
    email: email.toLowerCase(),
    password: myEncPassword,
  });
});

module.exports = app;
