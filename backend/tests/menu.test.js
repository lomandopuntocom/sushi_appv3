const request = require('supertest');
const app = require('../src/app');

describe('Menú', () => {
  let adminToken;
  let clientToken;
  let testDishId;

  beforeAll(async () => {
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@sushi.test', contrasena: 'Admin123' });
    adminToken = adminRes.body.token;

    const clientRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'cliente@sushi.test', contrasena: 'Cliente123' });
    clientToken = clientRes.body.token;
  });

  describe('GET /api/menu', () => {
    it('debería devolver el menú', async () => {
      const res = await request(app).get('/api/menu');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/menu/categorias', () => {
    it('debería devolver las categorías', async () => {
      const res = await request(app).get('/api/menu/categorias');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/menu/categorias', () => {
    it('debería crear categoría como admin', async () => {
      const res = await request(app)
        .post('/api/menu/categorias')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: `Test Cat ${Date.now()}` });
      expect(res.status).toBe(201);
      expect(res.body.nombre).toBeDefined();
    });

    it('debería rechazar crear categoría como cliente', async () => {
      const res = await request(app)
        .post('/api/menu/categorias')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ nombre: 'Test Cat' });
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/menu', () => {
    it('debería crear platillo como admin', async () => {
      const res = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Test Dish', descripcion: 'A test dish', precio: 99.99, idcategoria: 1 });
      expect(res.status).toBe(201);
      expect(res.body.nombre).toBe('Test Dish');
      testDishId = res.body.id;
    });

    it('debería rechazar crear platillo como cliente', async () => {
      const res = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ nombre: 'Test Dish', precio: 99.99, idcategoria: 1 });
      expect(res.status).toBe(403);
    });

    it('debería rechazar crear platillo sin datos obligatorios', async () => {
      const res = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Test' });
      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/menu/:id', () => {
    it('debería actualizar platillo como admin', async () => {
      if (!testDishId) return;
      const res = await request(app)
        .put(`/api/menu/${testDishId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Updated Dish', descripcion: 'Updated', precio: 150, idcategoria: 1 });
      expect(res.status).toBe(200);
      expect(res.body.nombre).toBe('Updated Dish');
    });
  });

  describe('DELETE /api/menu/:id', () => {
    it('debería eliminar platillo como admin', async () => {
      if (!testDishId) return;
      const res = await request(app)
        .delete(`/api/menu/${testDishId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it('debería rechazar eliminar platillo como cliente', async () => {
      const createRes = await request(app)
        .post('/api/menu')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ nombre: 'Temp Dish', precio: 50, idcategoria: 1 });
      const tempId = createRes.body.id;

      const res = await request(app)
        .delete(`/api/menu/${tempId}`)
        .set('Authorization', `Bearer ${clientToken}`);
      expect(res.status).toBe(403);
    });
  });
});
