const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const db = require("../../config/database");
const User = db.import("../../models/user");
const passport = require("passport");

// @route   GET api/auth/
// @desc    Test route
// @access  Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // console.log(req.user.id);
      const user = await User.findByPk(req.user.id);
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send();
    }
  }
);
// @route   GET api/users/
// @desc    Test route
// @access  Public
router.get("/", async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send();
  }
});

// @route   POST api/auth/login
// @desc    Login Route using passport-local
// @access  Public
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (err || !user) {
//       return res.status(400).json({
//         message: "Something is not right",
//         user: user
//       });
//     }
//
//     req.login(user, err => {
//       if (err) {
//         res.send(err);
//       }
//
//       const payload = {
//         user
//       };
//
//       jwt.sign(
//         payload,
//         process.env.SECRET,
//         { expiresIn: 360000 },
//         (err, token) => {
//           if (err) throw err;
//           res.json({ token, user: payload.user });
//         }
//       );
//     });
//     // successRedirect: "/users/all"
//   })(req, res, next);
// });

// @route   POST api/auth/login
// @desc    Login Route
// @access  Public
router.post("/login", [], async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const payload = {
      user: {
        id: user.id,
        email
      }
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    next(new Error(err.message));
  }
});

module.exports = router;
