const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../jwt_secret/config');
const bcrypt = require('bcryptjs');

let adminController = {};

adminController.login = async function (req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.role !== 'Admin') return res.status(404).send("Admin not found");

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
      expiresIn: 86400, // 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    res.status(500).send("Error on the server.");
  }
};

adminController.getAllUsers = async function (req, res) {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send("There was a problem finding the users.");
  }
};

module.exports = adminController;
