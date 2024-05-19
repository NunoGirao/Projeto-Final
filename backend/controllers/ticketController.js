const Event = require('../models/Event');
const User = require('../models/User');
const QRCode = require('qrcode');

const ticketController = {};

ticketController.purchaseTicket = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.occupation >= event.capacity) {
            return res.status(400).json({ message: "No tickets available" });
        }

        const ticket = { user: userId, purchaseDate: new Date() };
        event.tickets.push(ticket);
        event.occupation += 1;
        await event.save();

        // Generate QR code for the ticket
        const qrData = `${userId}-${eventId}-${ticket.purchaseDate}`;
        const qrCode = await QRCode.toDataURL(qrData);

        res.status(200).json({ message: "Ticket purchased successfully", qrCode });
    } catch (err) {
        res.status(500).json({ message: "Error purchasing ticket: " + err.message });
    }
};

ticketController.getUserTickets = async (req, res) => {
    try {
        const userId = req.user._id;
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

module.exports = ticketController;
