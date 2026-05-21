const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getMenu = async (_req, res) => {
	try {
		const platillos = await prisma.platillo.findMany({
			include: { categoria: true },
			orderBy: { id: "asc" },
		});

		res.json(platillos);
	} catch (_error) {
		res.status(500).json({ mensaje: "Error al obtener el menu" });
	}
};

const getCategorias = async (_req, res) => {
	try {
		const categorias = await prisma.categoria.findMany({
			orderBy: { nombre: "asc" },
		});

		res.json(categorias);
	} catch (_error) {
		res.status(500).json({ mensaje: "Error al obtener las categorias" });
	}
};

const crearCategoria = async (req, res) => {
	try {
		const { nombre } = req.body;

		if (!nombre) {
			return res
				.status(400)
				.json({ mensaje: "El nombre de la categoria es obligatorio" });
		}

		const categoria = await prisma.categoria.create({
			data: { nombre },
		});

		res.status(201).json(categoria);
	} catch (_error) {
		res.status(500).json({ mensaje: "Error al crear la categoria" });
	}
};

const crearPlatillo = async (req, res) => {
	try {
		const { nombre, descripcion, precio, image, idcategoria } = req.body;

		if (!nombre || !precio || !idcategoria) {
			return res
				.status(400)
				.json({ mensaje: "Nombre, precio y categoria son obligatorios" });
		}

		const platillo = await prisma.platillo.create({
			data: {
				nombre,
				descripcion,
				precio,
				image,
				idcategoria: Number(idcategoria),
			},
			include: { categoria: true },
		});

		res.status(201).json(platillo);
	} catch (_error) {
		res.status(500).json({ mensaje: "Error al crear el platillo" });
	}
};

const actualizarPlatillo = async (req, res) => {
	try {
		const { id } = req.params;
		const { nombre, descripcion, precio, image, idcategoria } = req.body;

		if (!nombre || !precio || !idcategoria) {
			return res
				.status(400)
				.json({ mensaje: "Nombre, precio y categoria son obligatorios" });
		}

		const platillo = await prisma.platillo.update({
			where: { id: Number(id) },
			data: {
				nombre,
				descripcion,
				precio,
				image,
				idcategoria: Number(idcategoria),
			},
			include: { categoria: true },
		});

		res.json(platillo);
	} catch (_error) {
		res.status(500).json({ mensaje: "Error al actualizar el platillo" });
	}
};

const eliminarPlatillo = async (req, res) => {
	try {
		const { id } = req.params;

		await prisma.platillo.delete({
			where: { id: Number(id) },
		});

		res.json({ mensaje: "Platillo eliminado correctamente" });
	} catch (_error) {
		res.status(500).json({ mensaje: "Error al eliminar el platillo" });
	}
};

module.exports = {
	getMenu,
	getCategorias,
	crearCategoria,
	crearPlatillo,
	actualizarPlatillo,
	eliminarPlatillo,
};
