const express = require('express');
const userController = require('../controllers/userController');
const verifyUserToken = require('../middleware/authUser');

const router = express.Router();

router.post('/scan-qr', verifyUserToken, userController.processQrCode);

// Export the router
module.exports = router;
