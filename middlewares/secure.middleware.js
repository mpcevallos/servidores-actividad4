const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

module.exports.checkAuth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Token de autorización no proporcionado" });
    }

    const token = authorization.split("Bearer ")[1];
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded) {
      return res.status(200).json({ token });
    }
    // Si todas las comprobaciones pasan, continúa con la ejecución
    res.status(200).json({ message: "Token válido" });
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ message: "Token inválido o expirado", error: error.message });
  }
};
