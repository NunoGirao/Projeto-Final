const Event = require('../models/Event');
const User = require('../models/User');

const authorizeTicketOwnerOrAdmin = async (req, res, next) => {
  try {
    const { qrData } = req.body;
    const userId = req.user._id;

    const [ticketUserId, eventId, ticketId] = qrData.split('-');

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticket = event.tickets.id(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (req.user.role !== 'Admin' && userId.toString() !== ticketUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    req.ticketUserId = ticketUserId; // Attach ticketUserId to req for later use
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authorization error: ' + error.message });
  }
};

module.exports = authorizeTicketOwnerOrAdmin;
