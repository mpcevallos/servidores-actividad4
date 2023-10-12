const jwtSecret = process.env.JWT_SECRET;
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
module.exports.create = async (req, res) => {
  // console.log("body:", req.body);
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password, active: false });
    const token = jwt.sign(
      { email, sub: user._id, exp: Date.now() / 1000 + 3600 },
      "super-secret"
    );
    user.token = token;
    await user.save();
    const confirmationLink = `http://localhost:8000/api/users/confirm/${token}`;
    res.status(201).json({ user, confirmationLink });
  } catch (error) {
    res.status(400).json({ message: "Error creating user" }); // 400 Bad Request
  }
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

exports.confirm = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.active = true; // set active to true
    user.token = ""; // remove token
    await user.save(); // save user to db

    res.status(200).json({ message: "Account confirmed" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.active) {
      return res.status(401).json({ message: "Account not confirmed" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ email }, jwtSecret);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password, active: false });
    const token = jwt.sign({ email }, "super-secret", {
      expiresIn: "1h",
      subject: user._id.toString(),
    });
    user.token = token;
    await user.save();
    const confirmationLink = `http://localhost:8000/api/users/confirm/${token}`;
    res.status(201).json({ user, confirmationLink });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
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
