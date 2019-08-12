const express = require("express");

// Require dotenv file and set it's path to the following...
require("dotenv").config({ path: __dirname + "/.env" });

// Require the DATABASE
const db = require("./config/database");

// Connect to the DATABASE
db.authenticate()
  .then(() => {
    console.log("Connection to ☕ database is succesful!");
  })
  .catch(err => {
    console.error("Unable to connect to ☕ database", err);
  });

// point app to the express instance
var app = express();

// Listen to see if the application has succesffuly connected to the port
app.listen(process.env.PORT, () => {
  console.log(`app is on port ${process.env.PORT}`);
});
