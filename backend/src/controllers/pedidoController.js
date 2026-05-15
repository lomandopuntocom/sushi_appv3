const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const procesarCompra = async (req, res) => {
  try {
    // Obtenemos el ID del usuario directamente del token validado por el middleware
    const idusuario = req.usuario.id; 
    const { items } = req.body; // El frontend nos enviará el array del carrito

    if (!items || items.length === 0) {
      return res.status(400).json({ mensaje: 'El carrito está vacío' });
    }

    // Iniciamos la transacción en la base de datos
    const nuevoPedido = await prisma.$transaction(async (tx) => {
      
      // 1. Crear el registro maestro del Carrito
      const carrito = await tx.carrito.create({
        data: {
          idusuario: idusuario,
          estado: 'PAGADO', // Simulamos el pago directo
        }
      });

      // 2. Mapear los items del frontend para la tabla intermedia
      const platosData = items.map((item) => ({
        idcarrito: carrito.id,
        idplato: item.id,
        cantidad: item.cantidad
      }));

      // 3. Insertar todos los platos asociados a ese carrito
      await tx.plato_carrito.createMany({
        data: platosData
      });

      return carrito;
    });

    res.status(201).json({ 
      mensaje: '¡Compra realizada con éxito!', 
      idPedido: nuevoPedido.id 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno al procesar la compra' });
  }
};

module.exports = { procesarCompra };