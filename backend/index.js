const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const placeRoutes = require('./routes/placeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/followRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Add this line

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URL);

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/cart', cartRoutes); // Add this line
app.use('/api', followRoutes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
  res.render('auth/adminLogin');
});

app.get('/admin/dashboard', (req, res) => {
  res.render('adminDashboard');
});

app.get('/admin/places', (req, res) => {
  res.render('places/adminPlaces');
});

app.get('/admin/places/create', (req, res) => {
  res.render('places/createPlace');
});

app.get('/admin/places/edit/:id', (req, res) => {
  res.render('places/editPlace');
});

app.get('/admin/places/view/:id', (req, res) => {
  res.render('places/viewPlace');
});

app.get('/admin/events', (req, res) => {
  res.render('events/adminEvents');
});

app.get('/admin/events/create', (req, res) => {
  res.render('events/createEvent');
});

app.get('/admin/events/edit/:id', (req, res) => {
  res.render('events/editEvent');
});

app.get('/admin/events/view/:id', (req, res) => {
  res.render('events/viewEvent');
});

app.get('/admin/users', (req, res) => {
  res.render('users/adminUsers');
});

app.get('/admin/users/view/:id', (req, res) => {
  res.render('users/viewUser');
});

app.get('/admin/users/edit/:id', (req, res) => {
  res.render('users/editUser');
});

app.get('/admin/users/create', (req, res) => {
  res.render('users/createUser');
});

app.get('/admin/tickets', (req, res) => {
  res.render('tickets/myTickets');
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
