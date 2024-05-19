const express = require('express');
const authRESTController = require('../controllers/authRESTController');

const router = express.Router();

router.post('/register', authRESTController.register);
router.post('/login', authRESTController.login);
router.post('/logout', authRESTController.logout);
router.get('/profile', authRESTController.verifyToken, authRESTController.profile);
router.post('/update-profile', authRESTController.verifyToken, authRESTController.updateProfile);

module.exports = router;
