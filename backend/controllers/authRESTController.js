const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../jwt_secret/config");
const bcrypt = require("bcryptjs");

let authRESTController = {};

authRESTController.login = function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(404).send("No user found");
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      }

      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400,
      });

      res.cookie('auth_token', token, { httpOnly: true });
      res.redirect('/backoffice');
    })
    .catch(err => {
      console.error("Error on the server:", err);
      res.status(500).send("Error on the server.");
    });
};

authRESTController.logout = function (req, res) {
  res.clearCookie('auth_token');
  res.redirect('/auth/login');
};

authRESTController.verifyToken = function (req, res, next) {
  var token = req.cookies.auth_token;

  if (!token)
    return res.redirect('/auth/login');

  jwt.verify(token, config.secret, async function (err, decoded) {
    if (err) {
      res.clearCookie('auth_token');
      return res.redirect('/auth/login');
    }

    req.user = await User.findOne({_id: decoded.id});
    next();
  });
};

authRESTController.verifyAdmin = function (req, res, next) {
  if (req.user.role !== 'Admin') {
    return res.status(403).send("Access denied.");
  }
  next();
};

module.exports = authRESTController;
