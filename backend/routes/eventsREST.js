const express = require('express');
const router = express.Router();
const eventRESTController = require('../controllers/eventRESTController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/events', eventRESTController.showAllEvents);
router.post('/events', upload.single('image'), eventRESTController.createEvent);
router.put('/events/:id', upload.single('image'), eventRESTController.editEvent);
router.get('/events/:id', eventRESTController.showEvent);

module.exports = router;
