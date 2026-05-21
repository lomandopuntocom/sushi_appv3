const express = require('express');
const router = express.Router();
const { registrar, login, obtenerPerfil } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/me', verificarToken, obtenerPerfil);

module.exports = router;
