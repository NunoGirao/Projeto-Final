const User = require('../models/User');
const Event = require('../models/Event');
const path = require('path');
const bcrypt = require('bcryptjs');
const bucket = require('../config/firebase'); // Assuming you have a Firebase setup

const userController = {};

// Utility function for uploading images to Firebase
async function uploadImageToFirebase(file) {
  const blob = bucket.file(Date.now() + path.extname(file.originalname));
  const blobStream = blob.createWriteStream({
    metadata: { contentType: file.mimetype }
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (error) => reject('Error uploading to Firebase: ' + error));
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

userController.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    // Fetch events with tickets that the user has purchased only if showPurchasedEvents is true
    const events = user.showPurchasedEvents 
      ? await Event.find({ 'tickets.user': userId }).select('nftImage') 
      : [];

    // Collect NFT images
    const nftImages = events.map(event => event.nftImage).filter(Boolean);

    res.status(200).send({
      ...user.toObject(),
      nftImages,
    });
  } catch (err) {
    res.status(500).send("Error retrieving user profile: " + err.message);
  }
};


userController.updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const profilePhotoUrl = await uploadImageToFirebase(req.file);
    const user = await User.findByIdAndUpdate(userId, { profilePhoto: profilePhotoUrl }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating profile photo:", err);
    res.status(500).json({ message: 'Error updating profile photo: ' + err.message });
  }
};

userController.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = new RegExp(query, 'i'); // Case-insensitive regex search

    const users = await User.find({ 
      $or: [
        { name: searchQuery },
        { email: searchQuery }
      ]
    }).select('name email profilePhoto');

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error searching users: ' + err.message });
  }
};

userController.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send("Error retrieving users: " + err.message);
  }
};

userController.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error retrieving user: " + err.message);
  }
};

userController.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) return res.status(404).send("User not found");
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send("Error updating user: " + err.message);
  }
};

userController.createUser = async (req, res) => {
  console.log("createUser function called");
  console.log("Request body:", req.body);
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();
    console.log("User created successfully:", savedUser);
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error creating user:", err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Error creating user: " + err.message });
  }
};

userController.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).send("User not found");
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send("Error deleting user: " + err.message);
  }
};

userController.getUserByName = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) return res.status(404).send("User not found");
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Error retrieving user: " + err.message);
  }
};

userController.getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).populate('following', 'name profilePhoto');
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user.following);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving following: ' + err.message });
  }
};

userController.getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).populate('followers', 'name profilePhoto');
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(user.followers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving followers: ' + err.message });
  }
};

// New endpoint to fetch NFT images for a user
userController.getNftImages = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch events with tickets that the user has purchased
    const events = await Event.find({ 'tickets.user': userId }).select('nftImage');

    // Collect NFT images
    const nftImages = events.map(event => event.nftImage).filter(Boolean);

    res.status(200).json({ nftImages });
  } catch (err) {
    console.error('Error fetching NFT images:', err);
    res.status(500).json({ message: 'Error fetching NFT images: ' + err.message });
  }
};

userController.processQrCode = async (req, res) => {
  const { qrData } = req.body;
  const [userId, eventId] = qrData.split('-'); // Adjust according to your QR code format

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.nftImages) {
      user.nftImages = [];
    }

    // Check if user already has the NFT image to avoid duplicates
    if (!user.nftImages.includes(event.nftImage)) {
      user.nftImages.push(event.nftImage);
      await user.save();
    }

    res.status(200).json({ message: 'NFT image added to user profile' });
  } catch (err) {
    res.status(500).json({ message: 'Error processing QR code: ' + err.message });
  }
};

userController.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = new RegExp(query, 'i'); // Case-insensitive regex search

    const users = await User.find({ 
      $or: [
        { name: searchQuery },
        { email: searchQuery }
      ]
    }).select('name email profilePhoto');

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error searching users: ' + err.message });
  }
};

userController.getUserSettings = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    res.status(200).json({
      showPurchasedEvents: user.showPurchasedEvents,
      profile: user.profile, // Assuming you have a profile field in the user schema
      profilePhoto: user.profilePhoto,
      email: user.email,
    });
  } catch (err) {
    console.error('Error retrieving user settings:', err);
    res.status(500).send("Error retrieving user settings: " + err.message);
  }
};

userController.updateUserSettings = async (req, res) => {
  const userId = req.user.id;
  const { showPurchasedEvents, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    if (typeof showPurchasedEvents !== 'undefined') {
      user.showPurchasedEvents = showPurchasedEvents;
    }

    if (email) {
      user.email = email;
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).send('Current password is incorrect');
      }
      user.password = bcrypt.hashSync(newPassword, 8);
    }

    await user.save();

    res.status(200).json({
      showPurchasedEvents: user.showPurchasedEvents,
      profile: user.profile, // Assuming you have a profile field in the user schema
      profilePhoto: user.profilePhoto,
      email: user.email,
    });
  } catch (err) {
    console.error('Error updating user settings:', err);
    res.status(500).send("Error updating user settings: " + err.message);
  }
};

userController.getUserDetailsAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch events where the user has tickets
    const events = await Event.find({ 'tickets.user': userId });

    // Prepare ticket information
    const tickets = events.flatMap(event => 
      event.tickets
        .filter(ticket => ticket.user.toString() === userId)
        .map(ticket => ({
          _id: ticket._id,
          eventName: event.name,
          eventDate: event.date,
          purchaseDate: ticket.purchaseDate,
          redeemed: ticket.redeemed,
          qrCode: ticket.qrCode
        }))
    );

    // Combine user data with ticket information
    const userDetails = {
      ...user.toObject(),
      tickets: tickets,
      nftImagesCount: user.nftImages.length
    };

    res.status(200).json(userDetails);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: "Error fetching user details: " + err.message });
  }
};

module.exports = userController;
