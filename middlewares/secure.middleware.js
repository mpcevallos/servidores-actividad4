const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

module.exports.checkAuth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split("Bearer ")[1];
    jwt.verify(token, jwtSecret);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized", error: error });
  }
};
