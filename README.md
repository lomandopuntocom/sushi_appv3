# Sushi App v3

Aplicacion web con frontend React, backend Express, Prisma, PostgreSQL, autenticacion JWT, roles de cliente/administrador, carrito, catalogo de platillos y blog con Markdown.

## Ejecucion con Docker

Requisitos:

- Docker Desktop

Levantar la aplicacion:

```bash
docker compose up --build
```

Servicios:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:5432

El backend ejecuta `prisma db push` al iniciar para crear/sincronizar las tablas en el PostgreSQL del compose.

Credenciales demo creadas por el seed:

- Admin: `admin@sushi.test` / `Admin123`
- Cliente: `cliente@sushi.test` / `Cliente123`

Detener servicios:

```bash
docker compose down
```

Detener y borrar la base local del compose:

```bash
docker compose down -v
```

## Variables de entorno

Para ejecucion local sin Docker, copia `backend/.env.example` a `backend/.env` y ajusta:

```bash
DATABASE_URL=postgresql://usuario:password@host:puerto/db?schema=public
JWT_SECRET=tu-secreto
PORT=3000
```

## Roles

- Los registros normales crean usuarios `CLIENTE`.
- Un usuario administrador debe tener rol `ADMINISTRADOR` en la tabla `usuario`.
- El admin puede administrar catalogo de platillos y posts del blog.
- El cliente puede navegar el menu, usar carrito y leer el blog.

## CI/CD

El workflow de GitHub Actions esta en `.github/workflows/ci.yml` y se ejecuta en `push` a `main`/`master` y en `pull_request`.

Valida:

- lint general del repositorio con Biome
- generacion de Prisma Client
- chequeo de sintaxis del backend
- lint del frontend
- build de produccion del frontend
- build de imagenes Docker con `docker compose build`
