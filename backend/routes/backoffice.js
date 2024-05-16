const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('mainIndex');
  });
  
const eventRoutes = require('./events');
const placeRoutes = require('./places');
const userRoutes = require('./userREST'); // Verifique se este caminho está correto
const ticketRoutes = require('./tickets');

router.use('/events', eventRoutes);
router.use('/places', placeRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
