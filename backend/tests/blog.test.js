const request = require("supertest");
const app = require("../src/app");

describe("Blog", () => {
	let adminToken;
	let testPostId;

	beforeAll(async () => {
		const adminRes = await request(app)
			.post("/api/auth/login")
			.send({ email: "admin@sushi.test", contrasena: "Admin123" });
		adminToken = adminRes.body.token;
	});

	describe("GET /api/blog", () => {
		it("debería devolver publicaciones", async () => {
			const res = await request(app).get("/api/blog");
			expect(res.status).toBe(200);
			expect(Array.isArray(res.body)).toBe(true);
		});
	});

	describe("POST /api/blog", () => {
		it("debería crear post como admin", async () => {
			const res = await request(app)
				.post("/api/blog")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({
					nombre: "Test Post",
					descripcion: "A test post",
					contenido: "Test content content",
				});
			expect(res.status).toBe(201);
			expect(res.body.nombre).toBe("Test Post");
			testPostId = res.body.id;
		});

		it("debería rechazar crear post sin título", async () => {
			const res = await request(app)
				.post("/api/blog")
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ contenido: "Test" });
			expect(res.status).toBe(400);
		});
	});

	describe("GET /api/blog/:id", () => {
		it("debería devolver un post por ID", async () => {
			if (!testPostId) return;
			const res = await request(app).get(`/api/blog/${testPostId}`);
			expect(res.status).toBe(200);
			expect(res.body.id).toBe(testPostId);
		});

		it("debería devolver 404 si no existe", async () => {
			const res = await request(app).get("/api/blog/99999");
			expect(res.status).toBe(404);
		});
	});

	describe("PUT /api/blog/:id", () => {
		it("debería actualizar post como admin", async () => {
			if (!testPostId) return;
			const res = await request(app)
				.put(`/api/blog/${testPostId}`)
				.set("Authorization", `Bearer ${adminToken}`)
				.send({ nombre: "Updated Post", contenido: "Updated content content" });
			expect(res.status).toBe(200);
			expect(res.body.nombre).toBe("Updated Post");
		});
	});

	describe("DELETE /api/blog/:id", () => {
		it("debería eliminar post como admin", async () => {
			if (!testPostId) return;
			const res = await request(app)
				.delete(`/api/blog/${testPostId}`)
				.set("Authorization", `Bearer ${adminToken}`);
			expect(res.status).toBe(200);
		});
	});
});
