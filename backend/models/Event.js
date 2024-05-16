var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    subtype: {
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
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place",
        required: true
    },
    image: {
        type: String,
    },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', EventSchema);
