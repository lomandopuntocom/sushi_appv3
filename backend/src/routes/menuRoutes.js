const express = require("express");
const router = express.Router();
const {
	actualizarPlatillo,
	crearCategoria,
	crearPlatillo,
	eliminarPlatillo,
	getCategorias,
	getMenu,
} = require("../controllers/menuController");
const {
	verificarAdmin,
	verificarToken,
} = require("../middlewares/authMiddleware");

const soloAdmin = [verificarToken, verificarAdmin];

router.get("/", getMenu);
router.get("/categorias", getCategorias);
router.post("/categorias", soloAdmin, crearCategoria);
router.post("/", soloAdmin, crearPlatillo);
router.put("/:id", soloAdmin, actualizarPlatillo);
router.delete("/:id", soloAdmin, eliminarPlatillo);

module.exports = router;
