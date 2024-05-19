const jwt = require('jsonwebtoken');
const config = require('../jwt_secret/config'); // Correct path to the config file

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Received Token:', token); // Log the received token

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    console.log('Decoded Token:', decoded); // Log the decoded token
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
