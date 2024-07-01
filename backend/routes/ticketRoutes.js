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
const verifyAdminToken = require('../middleware/authAdmin');

const router = express.Router();

// Route to purchase a ticket for a specific event
router.post('/purchase/:id', verifyUserToken, purchaseTicket);

// Route to get all tickets of the authenticated user
router.get('/user', verifyUserToken, getUserTickets);

// Route to search for tickets based on query parameters
router.get('/search', verifyUserToken, searchTickets);

// Route to get tickets for a specific user by their user ID
router.get('/user/:id', verifyUserToken, getTicketsByUserId);

// Route to get a specific ticket by its ID
router.get('/:id', verifyUserToken, getTicketById);

// Route to redeem a ticket (associate NFT image to user)
router.post('/redeem', verifyAdminToken, redeemTicket);

module.exports = router;
