const express = require('express');
const router = express.Router();
const placeRESTController = require("../controllers/placeRESTController");
const authRESTController = require('../controllers/authRESTController');

router.get('/', authRESTController.verifyToken, placeRESTController.showAll);
router.get('/show/:id', authRESTController.verifyToken, placeRESTController.show);
router.get('/search/name', authRESTController.verifyToken, placeRESTController.searchByName);
router.get('/search/address', authRESTController.verifyToken, placeRESTController.searchByAddress);
router.get('/search/category', authRESTController.verifyToken, placeRESTController.searchByCategory);
router.post('/create', authRESTController.verifyToken, placeRESTController.create); // Adicionando a rota POST para criar locais

module.exports = router;
