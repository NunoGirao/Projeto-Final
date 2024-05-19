const express = require('express');
const eventController = require('../controllers/eventController');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/search', eventController.searchEvents);
router.get('/category', eventController.getEventsByCategoryAndSubcategory);
router.get('/top-events', eventController.getTopEvents); // Correct route
router.get('/:id', eventController.getEventById);
router.post('/', upload.fields([{ name: 'image' }, { name: 'nftImage' }]), eventController.createEvent);
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'nftImage' }]), eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);



module.exports = router;
