const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController'); 
const authRESTController = require('../controllers/authRESTController');

router.get('/', authRESTController.verifyToken, eventController.showAllEvents);
router.get('/create', authRESTController.verifyToken, eventController.showCreateEventForm);
router.post('/create', authRESTController.verifyToken, eventController.createEvent);
router.get('/edit/:id', authRESTController.verifyToken, eventController.showEditEventForm);
router.post('/edit/:id', authRESTController.verifyToken, eventController.editEvent);
router.get('/show/:id', authRESTController.verifyToken, eventController.showEvent);
router.post('/delete/:id', authRESTController.verifyToken, eventController.deleteEvent);

module.exports = router;
