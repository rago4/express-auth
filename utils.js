const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const expressJwt = require("express-jwt");

const hashPassword = (password) => {
  return new Promise((resovle, reject) => {
    bcrypt.genSalt(12, (error, salt) => {
      if (error) {
        reject(error);
      }

      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error);
        }

        resovle(hash);
      });
    });
  });
};

const createToken = (user) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      iss: "api.express-auth",
      aud: "api.express-auth",
    },
    process.env.JWT_SECRET,
    { algorithm: "HS256", expiresIn: "1h" }
  );
};

const verifyPassword = (passwordAttempt, hashedPassword) =>
  bcrypt.compare(passwordAttempt, hashedPassword);

const attachUser = (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(" "); // => ["Bearer", token]

    if (!token) {
      return res.status(401).json({ message: "Authentication invalid" });
    }

    const decodedToken = jwtDecode(token);

    if (!decodedToken) {
      return res.status(401).json({
        message: "There was a problem authorizing the request",
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const requireAuth = expressJwt({
  secret: process.env.JWT_SECRET,
  audience: "api.express-auth",
  issuer: "api.express-auth",
  algorithms: ["HS256"],
});

module.exports = {
  hashPassword,
  createToken,
  verifyPassword,
  attachUser,
  requireAuth,
};
