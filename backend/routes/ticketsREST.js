var express = require('express');
var router = express.Router();
var ticketRESTController = require("../controllers/ticketRESTController");
var authRESTController = require('../controllers/authRESTController');

router.get('/', authRESTController.verifyToken, ticketRESTController.showUserTickets);
router.get('/show/:id', authRESTController.verifyToken, ticketRESTController.showTicket);
router.post('/buyTickets', authRESTController.verifyToken, ticketRESTController.buyTickets);

router.get('/purchases', authRESTController.verifyToken, ticketRESTController.showUserPurchases);
router.get('/purchases/show/:id', authRESTController.verifyToken, ticketRESTController.showPurchase);
router.get('/purchases/search/eventName', authRESTController.verifyToken, ticketRESTController.searchPurchaseByEvent);

module.exports = router;
