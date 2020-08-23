const express = require("express");
const validator = require("email-validator");
const jwtDecode = require("jwt-decode");
const User = require("../schemas/User");
const { hashPassword, createToken } = require("../utils");

const app = express();

app.post("/register", async (req, res) => {
  try {
    const { email = "", password = "" } = req.body;
    const lowercasedEmail = email.toLowerCase();

    if (!validator.validate(lowercasedEmail)) {
      return res
        .status(400)
        .json({ message: "Provided e-mail address is invalid" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const savedUser = await new User({
      email: lowercasedEmail,
      password: await hashPassword(password),
    }).save();

    if (!savedUser) {
      return res
        .status(400)
        .json({ message: "There was a problem creating your account" });
    }

    const token = createToken(savedUser);

    res.json({
      token,
      expiresAt: jwtDecode(token).exp,
      userInfo: { email: savedUser.email },
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = app;
