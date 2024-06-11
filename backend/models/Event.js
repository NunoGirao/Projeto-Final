const mongoose = require('mongoose');
const TicketSchema = require('./Ticket').schema; // Import the Ticket schema

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true, default: 0 },
  occupation: { type: Number, default: 0, required: true },
  capacity: { type: Number, required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  image: { type: String },
  nftImage: { type: String },
  category: {
    type: String,
    enum: ['Teatro & Arte', 'Música & Festivais', 'Família', 'Desporto & Aventura'],
    required: true,
  },
  subcategory: {
    type: String,
    enum: [
      'Teatro', 'Museus & Exposições', 'Dança',
      'Concertos', 'Festivais', 'Música Clássica', 'Fado',
      'Teatros & Espetáculos', 'Parques Temáticos', 'Cinema',
      'Corridas', 'Lazer'
    ],
    required: true,
  },
  description: { type: String },
  tickets: [TicketSchema],
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', EventSchema);
