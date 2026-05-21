/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./AdminCatalog.css";

const API_URL = "http://localhost:3000/api";
const initialForm = {
	nombre: "",
	descripcion: "",
	precio: "",
	image: "",
	idcategoria: "",
};

export default function AdminCatalog() {
	const { token } = useAuth();
	const [platillos, setPlatillos] = useState([]);
	const [categorias, setCategorias] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState(null);
	const [newCategory, setNewCategory] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	const headers = useMemo(
		() => ({
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		}),
		[token],
	);

	const cargarDatos = async () => {
		setLoading(true);
		setError("");

		try {
			const [menuResponse, categoriasResponse] = await Promise.all([
				fetch(`${API_URL}/menu`),
				fetch(`${API_URL}/menu/categorias`),
			]);

			if (!menuResponse.ok || !categoriasResponse.ok) {
				throw new Error("No se pudo cargar el catalogo");
			}

			const [menuData, categoriasData] = await Promise.all([
				menuResponse.json(),
				categoriasResponse.json(),
			]);

			setPlatillos(menuData);
			setCategorias(categoriasData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: only on mount
	useEffect(() => {
		cargarDatos();
	}, []);

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const resetForm = () => {
		setForm(initialForm);
		setEditingId(null);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		const url = editingId ? `${API_URL}/menu/${editingId}` : `${API_URL}/menu`;
		const method = editingId ? "PUT" : "POST";

		try {
			const response = await fetch(url, {
				method,
				headers,
				body: JSON.stringify(form),
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "No se pudo guardar el platillo");
			}

			resetForm();
			await cargarDatos();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleEdit = (platillo) => {
		setEditingId(platillo.id);
		setForm({
			nombre: platillo.nombre,
			descripcion: platillo.descripcion || "",
			precio: String(platillo.precio),
			image: platillo.image || "",
			idcategoria: String(platillo.idcategoria),
		});
	};

	const handleDelete = async (id) => {
		setError("");

		try {
			const response = await fetch(`${API_URL}/menu/${id}`, {
				method: "DELETE",
				headers,
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "No se pudo eliminar el platillo");
			}

			await cargarDatos();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleCreateCategory = async (event) => {
		event.preventDefault();
		setError("");

		try {
			const response = await fetch(`${API_URL}/menu/categorias`, {
				method: "POST",
				headers,
				body: JSON.stringify({ nombre: newCategory }),
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "No se pudo crear la categoria");
			}

			setNewCategory("");
			await cargarDatos();
			setForm((current) => ({ ...current, idcategoria: String(data.id) }));
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<main className="admin-catalog">
			<header className="admin-catalog__header">
				<div>
					<h1>Catalogo de platillos</h1>
					<p>Gestiona los platos visibles en el menu publico.</p>
				</div>
			</header>

			{error && <div className="admin-catalog__error">{error}</div>}

			<section className="admin-catalog__layout">
				<form className="admin-catalog__form" onSubmit={handleSubmit}>
					<h2>{editingId ? "Editar platillo" : "Nuevo platillo"}</h2>

					<label>
						Nombre
						<input
							name="nombre"
							value={form.nombre}
							onChange={handleChange}
							required
						/>
					</label>

					<label>
						Descripcion
						<textarea
							name="descripcion"
							value={form.descripcion}
							onChange={handleChange}
							rows="4"
						/>
					</label>

					<label>
						Precio
						<input
							name="precio"
							type="number"
							step="0.01"
							min="0"
							value={form.precio}
							onChange={handleChange}
							required
						/>
					</label>

					<label>
						Imagen
						<input
							name="image"
							value={form.image}
							onChange={handleChange}
							placeholder="/img/sushi.png"
						/>
					</label>

					<label>
						Categoria
						<select
							name="idcategoria"
							value={form.idcategoria}
							onChange={handleChange}
							required
						>
							<option value="">Selecciona una categoria</option>
							{categorias.map((categoria) => (
								<option key={categoria.id} value={categoria.id}>
									{categoria.nombre}
								</option>
							))}
						</select>
					</label>

					<div className="admin-catalog__actions">
						<button type="submit">
							{editingId ? "Guardar cambios" : "Crear platillo"}
						</button>
						{editingId && (
							<button type="button" onClick={resetForm}>
								Cancelar
							</button>
						)}
					</div>
				</form>

				<form
					className="admin-catalog__category"
					onSubmit={handleCreateCategory}
				>
					<h2>Nueva categoria</h2>
					<label>
						Nombre
						<input
							value={newCategory}
							onChange={(event) => setNewCategory(event.target.value)}
							required
						/>
					</label>
					<button type="submit">Crear categoria</button>
				</form>
			</section>

			<section className="admin-catalog__list">
				<h2>Platillos actuales</h2>
				{loading ? (
					<p>Cargando catalogo...</p>
				) : (
					<div className="admin-catalog__table">
						{platillos.map((platillo) => (
							<article key={platillo.id} className="admin-catalog__row">
								<div>
									<strong>{platillo.nombre}</strong>
									<span>
										{platillo.categoria?.nombre} - $
										{parseFloat(platillo.precio).toFixed(2)}
									</span>
								</div>
								<div className="admin-catalog__row-actions">
									<button type="button" onClick={() => handleEdit(platillo)}>
										Editar
									</button>
									<button
										type="button"
										onClick={() => handleDelete(platillo.id)}
									>
										Eliminar
									</button>
								</div>
							</article>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
