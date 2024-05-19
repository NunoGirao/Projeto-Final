const jwt = require('jsonwebtoken');
const config = require('../jwt_secret/config');
const User = require('../models/User');

const verifyAdminToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: "No token provided." });

  try {
    const decoded = jwt.verify(token, config.secret);
    req.user = await User.findById(decoded.id);

    if (req.user.role !== 'Admin') {
      return res.status(403).send({ auth: false, message: "Require Admin Role!" });
    }

    next();
  } catch (err) {
    res.status(500).send({ auth: false, message: "Failed to authenticate token." });
  }
};

module.exports = verifyAdminToken;
