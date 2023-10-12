const User = require("../models/users.model"); // import users model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.login = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((match) => {
        if (match) {
          const token = jwt.sign(
            { sub: user._id, exp: Date.now() / 1000 + 3600 },
            "super-secret"
          );

          res.json({ token: token });
        } else {
          res
            .status(400)
            .json({ message: "Unauthorized: Error de validación de datos" });
        }
      });
    } else {
      res
        .status(401)
        .json({ message: "Unauthorized: Credenciales incorrectas" });
    }
  });
};

// CREATE user
module.exports.create = (req, res) => {
  // console.log("body:", req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    req.body.password = hash;

    User.create(req.body)
      .then((user) => {
        // req.body contains the form data (or JSON)
        res.status(201).json(user); // 201 Created
      })
      .catch(() => {
        res.status(400).json({ message: "Error creating user" }); // 400 Bad Request
      });
  });
};

// GET user list
module.exports.list = (req, res) => {
  const criteria = {}; // empty object means find all

  if (req.query.name) {
    // req.query contains the query string parameters
    criteria.name = new RegExp(req.query.name, "i"); // i for case insensitive
  }

  User.find(criteria).then((users) => {
    // criteria filters the results
    res.json(users); // 200 OK
  });
};

// GET user by Id
module.exports.detail = (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const token = authorization.split("Bearer ")[1];
    jwt.verify(token, "super-secret");
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error });
  }

  User.findById(req.params.id).then((user) => {
    // req.params.id contains the id from the url
    if (user) {
      res.json(user); // 200 OK
    } else {
      res.status(404).json({ message: "User not found" }); // 404 Not Found
    }
  });
};

// PATCH user by Id
module.exports.update = (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    // req.body contains the updated data
    new: true, // return updated user instead of old user
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.json(user); // 200 OK
      } else {
        res.status(404).json({ message: "User not found" }); // 404 Not Found
      }
    })
    .catch(() => {
      res.status(400).json({ message: "Error updating user" }); // 400 Bad Request
    });
};

// DETELE user by Id
module.exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.id).then((user) => {
    if (user) {
      res.status(204).json(); // 204 No Content
    } else {
      res.status(404).json({ message: "User not found" }); // 404 Not Found
    }
  });
};
