/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../../context/AuthContext";
import "./AdminBlog.css";

const API_URL = "http://localhost:3000/api";
const initialForm = {
	nombre: "",
	descripcion: "",
	contenido: "",
};

export default function AdminBlog() {
	const { token } = useAuth();
	const [posts, setPosts] = useState([]);
	const [form, setForm] = useState(initialForm);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const headers = useMemo(
		() => ({
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		}),
		[token],
	);

	const cargarPosts = async () => {
		setLoading(true);
		setError("");

		try {
			const response = await fetch(`${API_URL}/blog`);

			if (!response.ok) {
				throw new Error("No se pudieron cargar los posts");
			}

			const data = await response.json();
			setPosts(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: only on mount
	useEffect(() => {
		cargarPosts();
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

		const url = editingId ? `${API_URL}/blog/${editingId}` : `${API_URL}/blog`;
		const method = editingId ? "PUT" : "POST";

		try {
			const response = await fetch(url, {
				method,
				headers,
				body: JSON.stringify(form),
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "No se pudo guardar el post");
			}

			resetForm();
			await cargarPosts();
		} catch (err) {
			setError(err.message);
		}
	};

	const handleEdit = (post) => {
		setEditingId(post.id);
		setForm({
			nombre: post.nombre,
			descripcion: post.descripcion || "",
			contenido: post.contenido,
		});
	};

	const handleDelete = async (id) => {
		setError("");

		try {
			const response = await fetch(`${API_URL}/blog/${id}`, {
				method: "DELETE",
				headers,
			});
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "No se pudo eliminar el post");
			}

			await cargarPosts();
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<main className="admin-blog">
			<header className="admin-blog__header">
				<div>
					<h1>Posts del blog</h1>
					<p>Crea y administra las publicaciones visibles para los clientes.</p>
				</div>
			</header>

			{error && <div className="admin-blog__error">{error}</div>}

			<section className="admin-blog__layout">
				<form className="admin-blog__form" onSubmit={handleSubmit}>
					<h2>{editingId ? "Editar post" : "Nuevo post"}</h2>
					<label>
						Titulo
						<input
							name="nombre"
							value={form.nombre}
							onChange={handleChange}
							required
						/>
					</label>
					<label>
						Descripcion corta
						<textarea
							name="descripcion"
							value={form.descripcion}
							onChange={handleChange}
							rows="3"
							placeholder="Resumen breve para mostrar en la tarjeta del blog"
						/>
					</label>
					<label>
						Contenido Markdown
						<textarea
							name="contenido"
							value={form.contenido}
							onChange={handleChange}
							rows="10"
							required
						/>
					</label>
					<div className="admin-blog__actions">
						<button type="submit">
							{editingId ? "Guardar cambios" : "Publicar post"}
						</button>
						{editingId && (
							<button type="button" onClick={resetForm}>
								Cancelar
							</button>
						)}
					</div>
				</form>

				<section className="admin-blog__preview">
					<h2>Vista previa</h2>
					{form.contenido ? (
						<div className="admin-blog__markdown">
							<ReactMarkdown>{form.contenido}</ReactMarkdown>
						</div>
					) : (
						<p>Escribe contenido en Markdown para ver la vista previa.</p>
					)}
				</section>

				<section className="admin-blog__list">
					<h2>Publicaciones</h2>
					{loading ? (
						<p>Cargando posts...</p>
					) : (
						<div className="admin-blog__items">
							{posts.map((post) => (
								<article key={post.id} className="admin-blog__item">
									<div>
										<strong>{post.nombre}</strong>
										<span>
											{post.autor || post.usuario?.nombre || "Sushi App"} -{" "}
											{new Date(post.fecha).toLocaleDateString()}
										</span>
									</div>
									<div className="admin-blog__actions">
										<button type="button" onClick={() => handleEdit(post)}>
											Editar
										</button>
										<button type="button" onClick={() => handleDelete(post.id)}>
											Eliminar
										</button>
									</div>
								</article>
							))}
						</div>
					)}
				</section>
			</section>
		</main>
	);
}
