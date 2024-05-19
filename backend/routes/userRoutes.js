const express = require('express');
const userController = require('../controllers/userController');
const verifyAdminToken = require('../middleware/authAdmin');
const upload = require('../middleware/upload');
const verifyUserToken = require('../middleware/authUser');

const router = express.Router();

router.get('/profile/me', verifyUserToken, userController.getUserProfile);
router.put('/profile-photo', verifyUserToken, upload.single('profilePhoto'), userController.updateProfilePhoto);
router.get('/:name/following', verifyUserToken, userController.getFollowing);
router.get('/:name/followers', verifyUserToken, userController.getFollowers);
router.get('/search', verifyUserToken, userController.searchUsers);
router.get('/', verifyAdminToken, userController.getAllUsers);
router.get('/name/:name', verifyUserToken, userController.getUserByName);

router.get('/:id', verifyAdminToken, userController.getUserById);
router.put('/:id', verifyAdminToken, userController.updateUser);
router.post('/', verifyAdminToken, userController.createUser);
router.delete('/:id', verifyAdminToken, userController.deleteUser);

module.exports = router;
