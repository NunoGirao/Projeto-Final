const express = require('express');
const adminController = require('../controllers/adminController');
const userController = require('../controllers/userController');
const verifyAdminToken = require('../middleware/authAdmin');

const router = express.Router();

router.post('/login', adminController.login);
router.get('/users', verifyAdminToken, adminController.getAllUsers);
router.get('/users/:id', verifyAdminToken, userController.getUserDetailsAdmin);

module.exports = router;
