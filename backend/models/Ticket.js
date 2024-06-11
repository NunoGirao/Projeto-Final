const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  purchaseDate: { type: Date, default: Date.now },
  qrCode: { type: String },
}, { _id: true });

module.exports = mongoose.model('Ticket', TicketSchema);
