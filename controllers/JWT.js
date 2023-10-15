const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET || "super-secret";

const generateJWT = (user) => {
  const token = jwt.sign({ userId: user._id }, jwtSecret, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = generateJWT;
