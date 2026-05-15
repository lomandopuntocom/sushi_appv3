const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getMenu = async (req, res) => {
  try {
    const platillos = await prisma.platillo.findMany({
      include: {
        categoria: true // Esto trae también el nombre de la categoría
      }
    });
    res.json(platillos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el menú' });
  }
};

module.exports = { getMenu };