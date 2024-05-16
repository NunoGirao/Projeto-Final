var express = require('express');
var router = express.Router();
const authRESTController = require('../controllers/authRESTController');

router.post('/login', authRESTController.login );
router.post('/register', authRESTController.register);
router.get('/logout', authRESTController.logout );
router.get('/profile', authRESTController.verifyToken, authRESTController.profile);
router.post('/updateProfile', authRESTController.verifyToken, authRESTController.updateProfile);

module.exports = router;
