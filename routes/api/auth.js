const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const db = require("../../config/database");
const User = db.import("../../models/user");

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

module.exports = router;
