const request = require("supertest");
const app = require("../src/app");

describe("Autenticación", () => {
	const testUser = {
		nombre: "Test User",
		email: `test_${Date.now()}@test.com`,
		contrasena: "Test123456",
	};
	let token;

	beforeAll(async () => {
		const adminRes = await request(app)
			.post("/api/auth/login")
			.send({ email: "admin@sushi.test", contrasena: "Admin123" });
		if (adminRes.status === 200) {
			token = adminRes.body.token;
		}
	});

	describe("POST /api/auth/registro", () => {
		it("debería registrar un usuario nuevo", async () => {
			const res = await request(app).post("/api/auth/registro").send(testUser);
			expect(res.status).toBe(201);
			expect(res.body.mensaje).toBe("Usuario registrado exitosamente");
		});

		it("debería rechazar registro con campos vacíos", async () => {
			const res = await request(app)
				.post("/api/auth/registro")
				.send({ nombre: "", email: "", contrasena: "" });
			expect(res.status).toBe(400);
			expect(res.body.mensaje).toBe("Todos los campos son obligatorios");
		});

		it("debería rechazar registro con email existente", async () => {
			const res = await request(app).post("/api/auth/registro").send({
				nombre: "Admin",
				email: "admin@sushi.test",
				contrasena: "Admin123",
			});
			expect(res.status).toBe(400);
			expect(res.body.mensaje).toBe("El correo ya está registrado");
		});
	});

	describe("POST /api/auth/login", () => {
		it("debería iniciar sesión con credenciales válidas", async () => {
			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "admin@sushi.test", contrasena: "Admin123" });
			expect(res.status).toBe(200);
			expect(res.body.token).toBeDefined();
			expect(res.body.usuario.rol).toBe("ADMINISTRADOR");
		});

		it("debería rechazar login con email incorrecto", async () => {
			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "noexiste@test.com", contrasena: "Admin123" });
			expect(res.status).toBe(401);
		});

		it("debería rechazar login con contraseña incorrecta", async () => {
			const res = await request(app)
				.post("/api/auth/login")
				.send({ email: "admin@sushi.test", contrasena: "wrongpassword" });
			expect(res.status).toBe(401);
		});
	});

	describe("GET /api/auth/me", () => {
		it("debería devolver el perfil con token válido", async () => {
			const res = await request(app)
				.get("/api/auth/me")
				.set("Authorization", `Bearer ${token}`);
			expect(res.status).toBe(200);
			expect(res.body.usuario.email).toBe("admin@sushi.test");
		});

		it("debería rechazar sin token", async () => {
			const res = await request(app).get("/api/auth/me");
			expect(res.status).toBe(401);
		});

		it("debería rechazar con token inválido", async () => {
			const res = await request(app)
				.get("/api/auth/me")
				.set("Authorization", "Bearer invalidtoken");
			expect(res.status).toBe(400);
		});
	});
});
