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

    const ticket = {
      user: userId,
      purchaseDate: new Date()
    };

    event.tickets.push(ticket);
    event.occupation += 1;
    await event.save();

    const ticketId = event.tickets[event.tickets.length - 1]._id;  // Get the newly created ticket ID
    const qrData = `${userId}-${eventId}-${ticketId}`;
    const qrCode = await QRCode.toDataURL(qrData);

    event.tickets[event.tickets.length - 1].qrCode = qrCode;
    await event.save();

    console.log(`Ticket purchased successfully: ${JSON.stringify(ticket)}`);
    res.status(200).json({ message: "Ticket purchased successfully", qrCode, ticketId });
  } catch (err) {
    console.error('Error purchasing ticket:', err);
    res.status(500).json({ message: "Error purchasing ticket: " + err.message });
  }
};

ticketController.getUserTickets = async (req, res) => {
  try {
    const userId = req.user._id;
    const events = await Event.find({ 'tickets.user': userId }).populate('place');

    const tickets = events.flatMap(event => 
      event.tickets.filter(ticket => ticket.user.equals(userId) && !ticket.redeemed).map(ticket => ({
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
        nftImage: event.nftImage
      }))
    );

    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error retrieving user tickets:', err);
    res.status(500).json({ message: "Error retrieving user tickets: " + err.message });
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
    console.log(`Fetching tickets for user ID: ${userId}`);
    
    const events = await Event.find({ 'tickets.user': userId }).populate('place');

    const tickets = events.flatMap(event => 
      event.tickets.filter(ticket => ticket.user.equals(userId)).map(ticket => ({
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
        nftImage: event.nftImage
      }))
    );

    res.status(200).json(tickets);
  } catch (err) {
    console.error('Error retrieving user tickets:', err);
    res.status(500).json({ message: "Error retrieving user tickets: " + err.message });
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
    const qrData = `${userId}-${event._id}-${ticket._id}`;
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
    const userId = req.user._id;

    console.log(`Redeeming ticket with QR data: ${qrData} for user ID: ${userId}`);

    const [ticketUserId, eventId, ticketId] = qrData.split('-');

    const event = await Event.findById(eventId);
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log(`Event found: ${event.name}`);

    const ticket = event.tickets.id(ticketId);

    if (!ticket) {
      console.log("Ticket not found");
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (ticket.redeemed) {
      console.log("Ticket already redeemed");
      return res.status(400).json({ message: 'Ticket already redeemed' });
    }

    console.log("Ticket found");

    if (req.user.role !== 'Admin' && userId.toString() !== ticketUserId) {
      console.log("Unauthorized: User ID does not match and user is not an admin");
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(ticketUserId);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Adding NFT image to user ${user._id}`);
    user.nftImages.push(event.nftImage);
    await user.save();

    ticket.redeemed = true;
    await event.save();

    res.status(200).json({ message: 'Ticket redeemed successfully', nftImage: event.nftImage });
  } catch (error) {
    console.error('Error redeeming ticket:', error);
    res.status(500).json({ message: 'Error redeeming ticket: ' + error.message });
  }
};

module.exports = ticketController;
