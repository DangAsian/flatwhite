const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passport = require("passport");
// Load User Model
const db = require("./database");
const User = db.import("../models/user");

// module.exports = function(passport) {
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    // Match User
    User.findOne({
      where: {
        email: email
      }
    })
      .then(user => {
        if (!user) {
          return done(null, false, {
            message: "That email is not registered"
          });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Password incorrect" });
          }
        });
      })
      .catch(err => console.log(err));
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id, (err, user) => {
    done(err, user);
  });
});
// };
