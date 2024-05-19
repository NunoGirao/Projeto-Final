const express = require('express');
const ticketController = require('../controllers/ticketController');
const verifyUserToken = require('../middleware/authUser'); // or your authentication middleware

const router = express.Router();

router.post('/purchase/:id', verifyUserToken, ticketController.purchaseTicket);
router.get('/user', verifyUserToken, ticketController.getUserTickets);
router.get('/search', verifyUserToken, ticketController.searchTickets); // Add search route
router.get('/:id', verifyUserToken, ticketController.getTicketsByUserId);

module.exports = router;
