// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "User" },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
  profilePhoto: { 
    type: String, 
    default: "https://storage.googleapis.com/pditrabalho.appspot.com/1716126416320.jpg"
  },
  nftImages: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  showPurchasedEvents: { type: Boolean, default: true },
  // We don't need to store tickets here as they are stored in the Event model
});

module.exports = mongoose.model("User", UserSchema);