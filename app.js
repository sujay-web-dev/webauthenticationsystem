const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>Hello from Auth System - WEB 3 </h1>");
});

module.exports = app;
