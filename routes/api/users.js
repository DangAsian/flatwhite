const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const db = require("../../config/database");
const User = db.import("../../models/user");

// RESTful routes (GET, POST, PUT, DELETE)

// @route   GET api/users/
// @desc    Test route
// @access  Public

router.get("/", (req, res) => {
  res.send("users route");
  console.log(User.findAll());
});

// @route   POST api/users/
// @desc    Test route
// @access  Public

router.post("/", (req, res) => {
  User.create({
    userName: "DangAsian",
    email: "dan.justin.ang@gmail.com",
    password: "12345"
  }).then(user => {
    console.log("User generated ID:", user.id);
  });
});

// @route   GET api/users/all
// @desc    Test route
// @access  Public
router.get("/all", (req, res) => {
  User.findAll().then(users => {
    res.json({ users: users });
  });
});

// @route POST api/users/register
// @desc  Register user
// @access Public
// Uses ValidationResult

router.post(
  "/register",
  [
    check("userName", "Username is required")
      .not()
      .isEmpty(),
    check("email", "Email must be valid").isEmail(),
    check("password", "Password is required")
      .isLength({ min: 6 })
      .not()
      .isEmpty()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { userName, email, password } = req.body;

    try {
      // Check if email is unique
      let user = await User.findOne({
        where: {
          email: req.body.email
        }
      });

      // Check is user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "email already in use" }] });
      }

      user = {
        userName,
        email,
        password
      };

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Create User and return token
      await User.create(user).then(x => {
        const payload = {
          user: {
            id: x.id,
            userName,
            email
          }
        };
        jwt.sign(
          payload,
          process.env.SECRET,
          { expiresIn: 360000 },
          (err, token) => {
            if (err) throw err;
            res.json({ token, user: payload.user });
          }
        );
      });
    } catch (err) {
      // Send a Error
      // next(new Error("Service side error"));
      console.log(err);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
