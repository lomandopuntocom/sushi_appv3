import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css"; // Tu CSS original

export default function Register() {
	const [formData, setFormData] = useState({
		nombre: "",
		email: "",
		contrasena: "",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("http://localhost:3000/api/auth/registro", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "Error al registrar");
			}

			// Si el registro es exitoso, lo enviamos al login
			navigate("/login");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="registration-container">
			{/* Puedes colocar tu imagen original de fondo aquí si el CSS la requiere */}
			<form className="registration-form" onSubmit={handleSubmit}>
				<h2>Crear Cuenta</h2>

				{error && (
					<div
						className="error-message"
						style={{ color: "red", marginBottom: "10px" }}
					>
						{error}
					</div>
				)}

				<div className="input-group">
					<label htmlFor="nombre">Nombre Completo</label>
					<input
						type="text"
						id="nombre"
						name="nombre"
						value={formData.nombre}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="input-group">
					<label htmlFor="email">Correo Electrónico</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="input-group">
					<label htmlFor="contrasena">Contraseña</label>
					<input
						type="password"
						id="contrasena"
						name="contrasena"
						value={formData.contrasena}
						onChange={handleChange}
						required
					/>
				</div>

				<button type="submit" disabled={loading}>
					{loading ? "Registrando..." : "Registrarse"}
				</button>

				<p>
					¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
				</p>
			</form>
		</div>
	);
}
