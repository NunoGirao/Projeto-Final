// controllers/ticketController.js

const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');

const ticketController = {};

ticketController.purchaseTicket = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    console.log(`Attempting to purchase ticket for event ID: ${eventId} by user ID: ${userId}`);

    const event = await Event.findById(eventId);
    if (!event) {
      console.log(`Event not found for ID: ${eventId}`);
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.occupation >= event.capacity) {
      console.log(`No tickets available for event ID: ${eventId}`);
      return res.status(400).json({ message: "No tickets available" });
    }

    const qrData = `${userId}-${eventId}-${new Date().toISOString()}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const ticket = {
      user: userId,
      qrCode: qrCode
    };

    event.tickets.push(ticket);
    event.occupation += 1;
    await event.save();

    console.log(`Ticket purchased successfully: ${JSON.stringify(ticket)}`);
    res.status(200).json({ message: "Ticket purchased successfully", qrCode, ticketId: ticket._id });
  } catch (err) {
    console.error('Error purchasing ticket:', err);
    res.status(500).json({ message: "Error purchasing ticket: " + err.message });
  }
};

ticketController.getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ 'tickets.user': userId }).populate('place');

    // Add QR codes to the response
    const tickets = events.flatMap(event => 
      event.tickets.filter(ticket => ticket.user.equals(userId)).map(ticket => ({
        ...ticket.toObject(),
        eventName: event.name,
        eventDate: event.date,
        eventPlace: event.place.name,
        eventDescription: event.description,
        image: event.image,
        price: event.price,
        occupation: event.occupation,
        capacity: event.capacity,
        type: event.category,
        subtype: event.subcategory
      }))
    );

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving tickets: " + err.message });
  }
};

ticketController.searchTickets = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = new RegExp(query, 'i'); // Case-insensitive regex search

    const events = await Event.find({
      $or: [
        { name: searchQuery },
        { type: searchQuery }
      ]
    }).populate('place');

    const userIds = await User.find({ name: searchQuery }).select('_id');
    const userTickets = await Event.find({
      'tickets.user': { $in: userIds }
    }).populate('place');

    const combinedResults = [...events, ...userTickets];

    res.status(200).json(combinedResults);
  } catch (err) {
    res.status(500).json({ message: "Error searching tickets: " + err.message });
  }
};

ticketController.getTicketsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find events where the user has purchased tickets
    const events = await Event.find({ 'tickets.user': userId }).populate('place');

    // Add QR codes to the response
    const eventsWithQrCodes = await Promise.all(events.map(async (event) => {
      const ticket = event.tickets.find(ticket => ticket.user.toString() === userId.toString());
      const qrData = `${userId}-${event._id}-${ticket.purchaseDate}`;
      const qrCode = await QRCode.toDataURL(qrData);
      return {
        ...event._doc,
        qrCode,
        nftImage: event.nftImage // Add the nftImage to the response
      };
    }));

    res.status(200).json(eventsWithQrCodes);
  } catch (err) {
    res.status500().json({ message: "Error retrieving tickets: " + err.message });
  }
};

ticketController.getTicketById = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user._id;

    console.log(`Fetching ticket with ID: ${ticketId} for user: ${userId}`);

    // Find the event containing the ticket
    const event = await Event.findOne({ 'tickets._id': ticketId }).populate('place');
    if (!event) {
      console.log(`Event not found for ticket ID: ${ticketId}`);
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find the ticket within the event
    const ticket = event.tickets.id(ticketId);
    if (!ticket) {
      console.log(`Ticket not found within event for ticket ID: ${ticketId}`);
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.user.toString() !== userId.toString()) {
      console.log(`User ${userId} does not have permission to view ticket ID: ${ticketId}`);
      return res.status(403).json({ message: 'You do not have permission to view this ticket.' });
    }

    // If ticket is found and belongs to the user, include the QR code and other details
    const qrData = `${userId}-${event._id}-${ticket.purchaseDate}`;
    const qrCode = await QRCode.toDataURL(qrData);

    res.status(200).json({
      ...ticket.toObject(),
      eventName: event.name,
      eventDate: event.date,
      eventPlace: event.place.name,
      eventDescription: event.description,
      eventImage: event.image,
      eventPrice: event.price,
      eventOccupation: event.occupation,
      eventCapacity: event.capacity,
      eventCategory: event.category,
      eventSubcategory: event.subcategory,
      nftImage: event.nftImage,  // Include the NFT image
      qrCode
    });
  } catch (err) {
    console.error(`Error retrieving ticket ID: ${ticketId}`, err);
    res.status(500).json({ message: "Error retrieving ticket: " + err.message });
  }
};

ticketController.redeemTicket = async (req, res) => {
  try {
    const { qrData } = req.body;
    const userId = req.user.id;

    // Find the ticket based on qrData
    const [ticketUserId, eventId, purchaseDate] = qrData.split('-');
    if (userId !== ticketUserId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const ticket = event.tickets.find(t => t.user.toString() === userId && t.purchaseDate.toISOString() === purchaseDate);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Add the nftImage to the user's profile
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.nftImages.push(event.nftImage);
    await user.save();

    res.status(200).json({ message: 'Ticket redeemed successfully', nftImage: event.nftImage });
  } catch (error) {
    console.error('Error redeeming ticket:', error);
    res.status(500).json({ message: 'Error redeeming ticket: ' + error.message });
  }
};

module.exports = ticketController;
