const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authRESTController = require('../controllers/authRESTController');

router.get('/', authRESTController.verifyToken, userController.showAll);
router.get('/show/:id', authRESTController.verifyToken, userController.show);
router.get('/edit/:id', authRESTController.verifyToken, userController.edit);
router.post('/update/:id', authRESTController.verifyToken, userController.update);
router.post('/delete/:id', authRESTController.verifyToken, userController.delete);

module.exports = router;
