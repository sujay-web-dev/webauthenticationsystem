require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const User = require("./model/user");
const auth = require("./middleware/auth");

app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System - WEB 3 </h1>");
});

app.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!(email && password && firstname && lastname)) {
      res.status(400).send("All fields are required");
    }

    const existingUser = await User.findOne({ email }); //PROMISE

    if (existingUser) {
      res.status(401).send("User Already Exists");
    }

    const myEncPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: myEncPassword,
    });

    //Token
    const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });
    user.token = token;

    //Handle Password situation
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log("ERROR-->", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Field is Missing");
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      user.password = undefined;
      // res.status(200).json(user);

      // if you want to use Cookies
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res
        .status(200)
        .cookie("token", token, options)
        .json({ success: true, token, user });
    }

    res.status(400).send("Email or Password is incorrect");
  } catch (err) {
    console.log("Error", err);
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.send("welcome to Secret DASHBOARD ");
});

module.exports = app;
