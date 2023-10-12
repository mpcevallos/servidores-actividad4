const jwtSecret = process.env.JWT_SECRET;
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");

exports.create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password, active: false });
    const token = jwt.sign({ email }, jwtSecret, {
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
