const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../jwt_secret/config');

const verifyUserToken = async (req, res, next) => {
  const token = req.headers['x-access-token']; // Retrieve token from headers
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' }); // Return 403 if no token is found
  }

  try {
    // Verify the token using jwt and the secret key
    const decoded = jwt.verify(token, config.secret);
    
    // Fetch the user associated with the decoded token's ID
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(404).json({ message: 'User not found.' }); // Return 404 if user is not found
    }

    next(); // Proceed to the next middleware or route handler if everything is valid
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' }); // Return 401 if token has expired
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' }); // Return 401 if token is invalid
    }
    console.error('Failed to authenticate token:', error); // Log any other errors
    return res.status(500).json({ message: 'Failed to authenticate token.' }); // Return 500 for other errors
  }
};

module.exports = verifyUserToken;
