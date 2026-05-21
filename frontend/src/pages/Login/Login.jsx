import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
	const [formData, setFormData] = useState({ email: "", contrasena: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("http://localhost:3000/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "Credenciales inválidas");
			}

			login(data);
			navigate(location.state?.from?.pathname || "/", { replace: true });
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-container">
			<form className="login-form" onSubmit={handleSubmit}>
				<h2>Iniciar Sesión</h2>

				{error && (
					<div
						className="error-message"
						style={{ color: "red", marginBottom: "10px" }}
					>
						{error}
					</div>
				)}

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
					{loading ? "Ingresando..." : "Entrar"}
				</button>

				<p>
					¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
				</p>
			</form>
		</div>
	);
}
