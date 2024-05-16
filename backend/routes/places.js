var express = require('express');
var router = express.Router();
const placeRESTController = require('../controllers/placeRESTController');
const authRESTController = require('../controllers/authRESTController');

router.get('/', authRESTController.verifyToken, authRESTController.verifyAdmin, placeRESTController.showAll);
router.get('/show/:id', authRESTController.verifyToken, authRESTController.verifyAdmin, placeRESTController.show);
router.get('/edit/:id', authRESTController.verifyToken, authRESTController.verifyAdmin, placeRESTController.edit);
router.post('/edit/:id', authRESTController.verifyToken, authRESTController.verifyAdmin, placeRESTController.update);
router.post('/delete/:id', authRESTController.verifyToken, authRESTController.verifyAdmin, placeRESTController.delete);
router.get('/create', authRESTController.verifyToken, authRESTController.verifyAdmin, (req, res) => res.render('places/create'));
router.post('/create', authRESTController.verifyToken, authRESTController.verifyAdmin, placeRESTController.create);

module.exports = router;
