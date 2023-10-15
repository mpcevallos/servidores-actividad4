const User = require("../models/users.model.js");

const findUser = async (email) => {
  try {
    // Buscar al usuario por su correo electrónico
    const user = await User.findOne({ email });

    return user; // Devuelve el usuario encontrado (o null si no se encuentra)
  } catch (error) {
    throw error; // Maneja errores de búsqueda, por ejemplo, errores de la base de datos
  }
};

module.exports = findUser;
