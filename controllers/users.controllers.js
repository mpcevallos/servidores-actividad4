const jwtSecret = process.env.JWT_SECRET || "super-secret"; // Importar el secreto del JWT
const User = require("../models/users.model"); // Importar el modelo de usuarios
const bcrypt = require("bcrypt"); // Importar el paquete bcrypt
const jwt = require("jsonwebtoken"); // Importar el paquete jsonwebtoken
const findUser = require("./findUser"); // Importar la función para buscar el usuario en la base de datos
const generateJWT = require("./JWT"); // Importar la función para generar el JWT

module.exports.login = async (req, res, next) => {
  console.log("Entro al controlador de login");
  try {
    // Validar que el usuario y la contraseña no estén vacíos
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ error: "Invalid login credentials" });
    }
    // Buscar el usuario en la base de datos
    const user = await findUser(req.body.email);
    console.log(user);

    // Si no existe el usuario, devolver un error
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    // Si existe el usuario, validar la contraseña
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(isPasswordValid);

    // Si la contraseña no es válida, devolver un error
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Si la contraseña es válida, generar el token JWT
    const token = generateJWT(user);
    console.log(token);

    // Enviar el token JWT en la respuesta
    res.json({ token });
    console.log({ token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

module.exports.create = async (req, res, next) => {
  try {
    // Validar que no falten campos obligatorios
    const { name, email, password, bio, active, confirmation } = req.body;

    if (!name || !email || !password || !bio || confirmation === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Validar que el email no esté registrado
    if (password !== confirmation) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // Validar que el email no esté registrado
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      bio,
      active,
      confirmation,
    });

    // Guardar el usuario en la base de datos
    const savedUser = await newUser.save();

    // Generar el token de confirmación
    const token = generateJWT(savedUser);

    // Enviar la respuesta con el token de confirmación y URL de confirmación
    res.status(201).json({
      message: "User created successfully",
      data: savedUser,
      confirmationToken: token,
      URLConfirmacion: `http://localhost:8000/api/users/confirm/${savedUser._id}`,
    });
  } catch (error) {
    // Si hay un error, devolver un error de servidor
    console.error(error);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

module.exports.confirm = async (req, res, next) => {
  try {
    // Validar que no falten campos obligatorios y que el token no esté vacío
    const token = req.body.token;
    const decodedToken = jwt.verify(token, jwtSecret);
    const userId = decodedToken.userId;

    // Buscar el usuario en la base de datos
    const user = await User.findById(userId);

    // Si no existe el usuario, devolver un error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Actualizar el usuario a activo y guardar en la base de datos
    user.active = true;
    await user.save();

    // Enviar la respuesta y mensaje de confirmación
    res.status(200).json({ message: "User account has been activated" });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

module.exports.list = (req, res) => {
  const criteria = { active: true }; // Solo usuarios verificados};

  if (req.query.name) {
    criteria.name = new RegExp(req.query.name, "i");
  }

  User.find(criteria).then((users) => {
    res.json(users);
  });
};

module.exports.detail = (req, res) => {
  User.findById(req.params.id).then((user) => {
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};

module.exports.update = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch(() => {
      res.status(400).json({ message: "Error updating user" });
    });
};

module.exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id).then((user) => {
    if (user) {
      res.status(204).json();
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
};
