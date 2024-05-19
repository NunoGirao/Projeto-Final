const express = require('express');
const verifyUserToken = require('../middleware/authUser');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/add', verifyUserToken, cartController.addToCart);
router.get('/', verifyUserToken, cartController.getCart);
router.post('/remove', verifyUserToken, cartController.removeFromCart);
router.post('/purchase', verifyUserToken, cartController.purchaseCart);

module.exports = router;
