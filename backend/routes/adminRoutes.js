const express = require('express');
const adminController = require('../controllers/adminController');
const verifyAdminToken = require('../middleware/authAdmin');

const router = express.Router();

router.post('/login', adminController.login);
router.get('/users', verifyAdminToken, adminController.getAllUsers);

module.exports = router;
