const express = require('express');
const placeController = require('../controllers/placeController');
const verifyAdminToken = require('../middleware/authAdmin');

const router = express.Router();

router.post('/', verifyAdminToken, placeController.createPlace);
router.get('/', verifyAdminToken, placeController.getAllPlaces);
router.get('/:id', verifyAdminToken, placeController.getPlaceById);
router.put('/:id', verifyAdminToken, placeController.updatePlace);
router.delete('/:id', verifyAdminToken, placeController.deletePlace);


module.exports = router;
