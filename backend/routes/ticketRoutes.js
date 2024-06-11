// routes/ticketRoutes.js

const express = require('express');
const { 
  purchaseTicket, 
  getUserTickets, 
  searchTickets, 
  getTicketsByUserId, 
  getTicketById, 
  redeemTicket 
} = require('../controllers/ticketController');
const verifyUserToken = require('../middleware/authUser');

const router = express.Router();

router.post('/purchase/:id', verifyUserToken, purchaseTicket);
router.get('/user', verifyUserToken, getUserTickets);
router.get('/search', verifyUserToken, searchTickets); // Add search route
router.get('/:id', verifyUserToken, getTicketById); // Correct this line to get a single ticket by ID
router.post('/redeem', verifyUserToken, redeemTicket);

module.exports = router;
