const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Función para Registrar Usuario
const registrar = async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;

    // 1. Validar que no haya campos vacíos
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // 2. Verificar si el email ya existe
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // 3. Encriptar la contraseña (Hash)
    const salt = await bcrypt.genSalt(10);
    const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

    // 4. Guardar en la base de datos
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        contrasena: contrasenaHasheada,
        // El rol se asignará automáticamente como 'CLIENTE' gracias al esquema de la BD
      },
    });

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Función para Iniciar Sesión
const login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // 1. Buscar al usuario por su email
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // 2. Comparar la contraseña ingresada con el Hash de la BD
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // 3. Generar el Token JWT
    // Solo guardamos el ID y el Rol en el token (NUNCA la contraseña)
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // El token expira en 1 día
    );

    // 4. Enviar respuesta exitosa con el token y datos básicos
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nombre: true,
        telefono: true,
        email: true,
        direccion: true,
        rol: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

module.exports = { registrar, login, obtenerPerfil };
