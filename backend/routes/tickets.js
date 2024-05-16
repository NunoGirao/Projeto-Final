const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController'); 
const authRESTController = require('../controllers/authRESTController');

router.get('/', authRESTController.verifyToken, ticketController.showAllTickets);
router.get('/show/:id', authRESTController.verifyToken, ticketController.showTicket);
router.post('/purchase', authRESTController.verifyToken, ticketController.purchaseTicket);
router.post('/cancel/:id', authRESTController.verifyToken, ticketController.cancelTicket);

module.exports = router;
