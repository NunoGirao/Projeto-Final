const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../jwt_secret/config");
const bcrypt = require("bcryptjs");

let authRESTController = {};

authRESTController.login = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("No user found");

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({ auth: true, token: token, userId: user._id });
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

authRESTController.logout = function (req, res) {
  res.status(200).send({ auth: false, token: null });
};

authRESTController.register = async function (req, res) {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).send("User with the same email already exists.");
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "User",
    });

    await user.save();

    const token = jwt.sign({ _id: user._id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    res.status(500).send("There was a problem registering the user.");
  }
};

authRESTController.profile = async function (req, res) {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(401).send("Token inválido");

  const userId = verifyToken(token);
  if (!userId) return res.status(401).send("Token inválido");

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Usuário não encontrado");

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Houve um problema ao buscar o usuário");
  }
};

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, config.secret);
    return decoded.id;
  } catch (err) {
    console.error("Failed to verify token:", err);
    return null;
  }
}

authRESTController.verifyToken = async function (req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

  try {
    const decoded = jwt.verify(token, config.secret);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(500).send({ auth: false, message: "Failed to authenticate token." });
  }
};

authRESTController.updateProfile = async function (req, res) {
  const userId = req.user._id;
  const { newName, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("Usuário não encontrado");

    if (oldPassword) {
      const passwordIsValid = bcrypt.compareSync(oldPassword, user.password);
      if (!passwordIsValid) return res.status(401).send("Senha antiga inválida");
    }

    if (newPassword) {
      const hashedNewPassword = bcrypt.hashSync(newPassword, 8);
      user.password = hashedNewPassword;
    }

    user.name = newName || user.name;

    const updatedUser = await user.save();
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send("Houve um problema ao atualizar o perfil do usuário");
  }
};

module.exports = authRESTController;
