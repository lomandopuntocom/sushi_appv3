const express = require('express');
const router = express.Router();
const { procesarCompra } = require('../controllers/pedidoController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Protegemos la ruta inyectando el middleware antes del controlador
router.post('/checkout', verificarToken, procesarCompra);

module.exports = router;