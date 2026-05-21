const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findOrCreateCategoria(nombre) {
  const categoriaExistente = await prisma.categoria.findFirst({
    where: { nombre },
  });

  if (categoriaExistente) {
    return categoriaExistente;
  }

  return prisma.categoria.create({
    data: { nombre },
  });
}

async function createPlatilloIfMissing(data) {
  const platilloExistente = await prisma.platillo.findFirst({
    where: { nombre: data.nombre },
  });

  if (platilloExistente) {
    return platilloExistente;
  }

  return prisma.platillo.create({ data });
}

async function createPostIfMissing(data) {
  const postExistente = await prisma.publicaciones.findFirst({
    where: { nombre: data.nombre },
  });

  if (postExistente) {
    return postExistente;
  }

  return prisma.publicaciones.create({ data });
}

async function main() {
  const passwordHash = await bcrypt.hash('Admin123', 10);
  const clientePasswordHash = await bcrypt.hash('Cliente123', 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@sushi.test' },
    update: {
      rol: 'ADMINISTRADOR',
    },
    create: {
      nombre: 'Admin Sushi',
      email: 'admin@sushi.test',
      contrasena: passwordHash,
      rol: 'ADMINISTRADOR',
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'cliente@sushi.test' },
    update: {},
    create: {
      nombre: 'Cliente Demo',
      email: 'cliente@sushi.test',
      contrasena: clientePasswordHash,
      rol: 'CLIENTE',
    },
  });

  const makis = await findOrCreateCategoria('Makis');
  const especiales = await findOrCreateCategoria('Especiales');

  await createPlatilloIfMissing({
    nombre: 'Salmon Maki',
    descripcion: 'Rollo clasico con salmon fresco, arroz y nori.',
    precio: '8.50',
    image: '/img/salmon-maki.png',
    idcategoria: makis.id,
  });

  await createPlatilloIfMissing({
    nombre: 'Dragon Elegance',
    descripcion: 'Rollo especial con palta, langostino y salsa de la casa.',
    precio: '12.90',
    image: '/img/dragon-elegance.png',
    idcategoria: especiales.id,
  });

  await createPostIfMissing({
    nombre: 'Como elegir tu primer sushi',
    descripcion: 'Una guia rapida para clientes que quieren empezar con sabores suaves y seguros.',
    contenido: '## Guia para empezar\n\nSi es tu primera vez, prueba sabores suaves como **salmon maki** o rolls con palta.\n\n- Empieza por makis clasicos\n- Agrega salsa de soya poco a poco\n- Prueba jengibre entre bocados\n\n> Lo importante es disfrutar el ritmo de la experiencia.',
    autor: admin.nombre,
    idusuario: admin.id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
