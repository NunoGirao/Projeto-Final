var mongoose = require('mongoose');

  var PurchaseSchema = new mongoose.Schema({
    purchaseDate: {
      type: "string",
      format: "date",
      required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
        type: String,
    },
    updated_at: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Purchase', PurchaseSchema);