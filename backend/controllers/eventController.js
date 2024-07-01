const path = require('path');
const Event = require('../models/Event');
const bucket = require('../config/firebase');
const Place = require('../models/Place');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

const eventController = {};

async function uploadImageToFirebase(file) {
  const blob = bucket.file(Date.now() + path.extname(file.originalname));
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype
    }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => {
      reject('Error uploading to Firebase: ' + error);
    });

    blobStream.on('finish', async () => {
      try {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        resolve(publicUrl);
      } catch (error) {
        reject('Error making file public: ' + error);
      }
    });

    blobStream.end(file.buffer);
  });
}

eventController.searchEvents = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = new RegExp(query, 'i'); // Case-insensitive regex search

    // Find places matching the query
    const places = await Place.find({ name: searchQuery }).select('_id');
    
    // Find events matching the query or associated with the found places
    const events = await Event.find({
      $or: [
        { name: searchQuery },
        { place: { $in: places } }
      ]
    }).populate('place');

    res.status(200).json(events);
  } catch (err) {
    console.error("Error searching events:", err); // Log detailed error
    res.status(500).json({ message: "Error searching events: " + err.message });
  }
};

eventController.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('place');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving event: " + err.message });
  }
};

eventController.createEvent = async (req, res) => {
  try {
    const { name, date, price, occupation, capacity, place, category, subcategory, description } = req.body;
    let imageUrl = null;
    let nftImageUrl = null;

    if (req.files && req.files.image) {
      imageUrl = await uploadImageToFirebase(req.files.image[0]);
    }

    if (req.files && req.files.nftImage) {
      nftImageUrl = await uploadImageToFirebase(req.files.nftImage[0]);
    }

    const newEvent = new Event({
      name,
      date,
      price, // Ensure the price field is included here
      occupation,
      capacity,
      place,
      category,
      subcategory,
      description,
      image: imageUrl,
      nftImage: nftImageUrl
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res.status(500).json({ message: "Error creating event: " + err.message });
  }
};

eventController.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('place');
    res.status(200).send(events);
  } catch (err) {
    res.status(500).send("Error retrieving events: " + err.message);
  }
};

eventController.getEventsByCategoryAndSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }

    if (subcategory) {
      query.subcategory = subcategory;
    }

    const events = await Event.find(query).populate('place');
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving events: " + err.message });
  }
};

eventController.updateEvent = async (req, res) => {
  try {
    const { name, date, price, occupation, capacity, place, category, subcategory, description } = req.body;
    let imageUrl = null;
    let nftImageUrl = null;

    if (req.files && req.files.image) {
      imageUrl = await uploadImageToFirebase(req.files.image[0]);
    }

    if (req.files && req.files.nftImage) {
      nftImageUrl = await uploadImageToFirebase(req.files.nftImage[0]);
    }

    const updateFields = {
      name,
      date,
      price,
      occupation,
      capacity,
      place,
      category,
      subcategory,
      description,
      updated_at: Date.now(),
    };

    if (imageUrl) {
      updateFields.image = imageUrl;
    }

    if (nftImageUrl) {
      updateFields.nftImage = nftImageUrl;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Error updating event: " + err.message });
  }
};

eventController.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).send("Event not found");
    res.status(200).send({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).send("Error deleting event: " + err.message);
  }
};

eventController.getTopEvents = async (req, res) => {
  try {
    console.log('Fetching top events...');
    const events = await Event.find().sort({ 'tickets.length': -1 }).populate('place');
    console.log('Top events fetched:', events);
    res.status(200).send(events);
  } catch (err) {
    console.error('Error fetching top events:', err); // Log detailed error
    res.status(500).send("Error fetching top events: " + err.message);
  }
};

eventController.getFollowersPurchases = async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.id;

    const user = await User.findById(userId).populate('following');
    const followingIds = user.following.map(following => following._id);

    const event = await Event.findById(eventId).populate('tickets.user');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const followingTickets = event.tickets.filter(ticket => 
      followingIds.some(id => id.equals(ticket.user._id)) &&
      ticket.user.showPurchasedEvents // Check the user's showPurchasedEvents setting
    );

    const uniqueUsers = new Map();
    followingTickets.forEach(ticket => {
      if (!uniqueUsers.has(ticket.user._id.toString())) {
        uniqueUsers.set(ticket.user._id.toString(), {
          _id: ticket.user._id,
          name: ticket.user.name,
          profilePhoto: ticket.user.profilePhoto,
        });
      }
    });

    res.status(200).json(Array.from(uniqueUsers.values()));
  } catch (err) {
    console.error('Error retrieving following purchases:', err);
    res.status(500).json({ message: 'Error retrieving following purchases' });
  }
};

module.exports = eventController;
