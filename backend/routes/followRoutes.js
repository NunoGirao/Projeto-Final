const express = require('express');
const followController = require('../controllers/followController');
const authRESTController = require('../controllers/authRESTController');

const router = express.Router();

router.post('/follow/:id', authRESTController.verifyToken, followController.follow);
router.post('/unfollow/:id', authRESTController.verifyToken, followController.unfollow);

module.exports = router;
