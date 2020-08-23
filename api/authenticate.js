const express = require("express");
const jwtDecode = require("jwt-decode");
const User = require("../schemas/User");
const { verifyPassword, createToken } = require("../utils");

const app = express();

app.post("/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowercasedEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowercasedEmail }).lean();

    if (!user) {
      return res.status(403).json({
        message: "Wrong e-mail address or password",
      });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(403)
        .json({ message: "Wrong e-mail address or password" });
    }

    const token = createToken(user);

    res.json({
      token,
      expiresAt: jwtDecode(token).exp,
      userInfo: { email: user.email },
      message: "User authenticated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = app;
