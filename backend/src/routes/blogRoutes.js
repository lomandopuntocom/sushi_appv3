const express = require('express');
const router = express.Router();
const {
  actualizarPost,
  crearPost,
  eliminarPost,
  getPostById,
  getPosts,
} = require('../controllers/blogController');
const { verificarAdmin, verificarToken } = require('../middlewares/authMiddleware');

const soloAdmin = [verificarToken, verificarAdmin];

router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', soloAdmin, crearPost);
router.put('/:id', soloAdmin, actualizarPost);
router.delete('/:id', soloAdmin, eliminarPost);

module.exports = router;
