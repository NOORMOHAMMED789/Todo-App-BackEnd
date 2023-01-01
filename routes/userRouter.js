const express = require("express");
const router = express.Router();
const User = require("../model/user");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const PRIVATE_KEY = process.env.PRIVATE_KEY || "1234noormohammed@encoded";

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

//! this handles the new registration of the user with authentication
router.post("/register", async (req, res) => {
  try {
    //!this case means if user already registered and try to register again with same mail.
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        status: "Failed",
        message: "Account already exists. Please, register !!",
      });
    }
    //! Hashing the both passwords into the hashcode.
    const hashed_password = await bcrypt.hash(req.body.password, saltRounds);
    const chashed_password = await bcrypt.hash(
      req.body.confirmPassword,
      saltRounds
    );
    const new_user = {
      email: req.body.email,
      password: hashed_password,
      confirmPassword: chashed_password,
    };
    //! creating the new user in the database
    const response = await User.create(new_user);
    res.status(201).json({
      status: "Success",
      message: "Registration Successfull",
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
});

//!this methods handles the already register user trying to login with credentails
router.post("/login", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    //!checking if the email is present or not
    const user = await User.findOne({ email: email });
    //! if the email is not present, then tell user to register first
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Account not found, Please Register !!",
      });
    }

    //! If user is found then, need to compare the passwords
    const response = bcrypt.compare(password, user.password);

    //!if the password matches then allow the user to login and generate token
    if (response) {
      const token = jwt.sign({ data: user.email }, PRIVATE_KEY, {
        expiresIn: "1h",
      });

      return res.json({
        status: "Success",
        message: "Token generated",
        token: token,
        email: user.email,
      });
    } else {
      res.status(401).json({
        status: "Failed",
        message: "Invalid Credentails",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
});

module.exports = router;
