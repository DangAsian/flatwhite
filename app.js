const express = require("express");
const passport = require("passport");

// point app to the express instance
var app = express();

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

// Init Middleware
// Already part of Express now, don't need to install body parser
app.use(express.json({ extended: false }));
// app.use(cors());

// Need Express Session Middleware?

// Passport config
require("./config/passport");
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// @route: 'https://localhost:5000/'
// @description: test
app.get("/", (req, res) => {
  res.send("Hello World 🐷");
});

// Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

// Listen to see if the application has succesffuly connected to the port
app.listen(process.env.PORT, () => {
  console.log(`app is on port ${process.env.PORT}`);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});
