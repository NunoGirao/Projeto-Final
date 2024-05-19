const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  occupation: {
    type: Number,
    default: 0,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true,
  },
  image: {
    type: String,
  },
  nftImage: {
    type: String,
  },
  category: {
    type: String,
    enum: ['Teatro & Arte', 'Música & Festivais', 'Família', 'Desporto & Aventura'],
    required: true,
  },
  subcategory: {
    type: String,
    enum: [
      'Teatro', 'Museus & Exposições', 'Dança', // subcategories for 'Teatro & Arte'
      'Concertos', 'Festivais', // subcategories for 'Música & Festivais'
      'Crianças', 'Família', // subcategories for 'Família'
      'Desportos', 'Aventura' // subcategories for 'Desporto & Aventura'
    ],
    required: true,
  },
  description: {
    type: String,
  },
  tickets: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    purchaseDate: { type: Date, default: Date.now },
    qrCode: { type: String },
  }],
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', EventSchema);
