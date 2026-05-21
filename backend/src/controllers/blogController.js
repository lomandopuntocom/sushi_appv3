const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getPosts = async (req, res) => {
  try {
    const posts = await prisma.publicaciones.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await prisma.publicaciones.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ mensaje: 'Post no encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el post' });
  }
};

const crearPost = async (req, res) => {
  try {
    const { nombre, descripcion, contenido } = req.body;

    if (!nombre || !contenido) {
      return res.status(400).json({ mensaje: 'Titulo y contenido son obligatorios' });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: { nombre: true },
    });

    const post = await prisma.publicaciones.create({
      data: {
        nombre,
        descripcion,
        contenido,
        autor: usuario?.nombre || 'Administrador',
        idusuario: req.usuario.id,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el post' });
  }
};

const actualizarPost = async (req, res) => {
  try {
    const { nombre, descripcion, contenido } = req.body;

    if (!nombre || !contenido) {
      return res.status(400).json({ mensaje: 'Titulo y contenido son obligatorios' });
    }

    const post = await prisma.publicaciones.update({
      where: { id: Number(req.params.id) },
      data: { nombre, descripcion, contenido },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
      },
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el post' });
  }
};

const eliminarPost = async (req, res) => {
  try {
    await prisma.publicaciones.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ mensaje: 'Post eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el post' });
  }
};

module.exports = {
  getPosts,
  getPostById,
  crearPost,
  actualizarPost,
  eliminarPost,
};
