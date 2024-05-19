const Cart = require('../models/Cart');
const Event = require('../models/Event');
const User = require('../models/User');

const cartController = {};

cartController.addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Use user ID from the token
    const { eventId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.event.toString() === eventId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ event: eventId, quantity });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart: ' + error.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.event');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving cart: ' + err.message });
  }
};

cartController.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { eventId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.event.toString() === eventId);
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart: ' + err.message });
  }
};

cartController.purchaseCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate('items.event');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    for (const item of cart.items) {
      if (item.event.occupation + item.quantity > item.event.capacity) {
        return res.status(400).json({ message: `Not enough tickets available for ${item.event.name}` });
      }

      item.event.tickets.push({ user: userId, purchaseDate: new Date() });
      item.event.occupation += item.quantity;
      await item.event.save();
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Purchase successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing purchase: ' + err.message });
  }
};

module.exports = cartController;
