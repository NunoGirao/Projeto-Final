// models/Ticket.js
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchaseDate: { type: Date, default: Date.now },
  qrCode: { type: String },
  redeemed: { type: Boolean, default: false } // Add redeemed field
}, { _id: true });

module.exports = mongoose.model('Ticket', TicketSchema);
