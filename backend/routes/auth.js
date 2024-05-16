var express = require('express');
var router = express.Router();
const authRESTController = require('../controllers/authRESTController');

// Renderiza a página de login
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Autenticação
router.post('/login', authRESTController.login);
router.get('/logout', authRESTController.logout);

module.exports = router;
