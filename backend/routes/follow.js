const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authRESTController = require('../controllers/authRESTController');

router.post('/follow/:id', authRESTController.verifyToken, followController.follow);
router.post('/unfollow/:id', authRESTController.verifyToken, followController.unfollow);

module.exports = router;
