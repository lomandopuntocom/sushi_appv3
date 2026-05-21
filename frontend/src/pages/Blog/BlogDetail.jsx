import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import "./Blog.css";

const API_URL = "http://localhost:3000/api";

export default function BlogDetail() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const cargarPost = async () => {
			try {
				const response = await fetch(`${API_URL}/blog/${id}`);

				if (!response.ok) {
					throw new Error("No se pudo cargar el post");
				}

				const data = await response.json();
				setPost(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		cargarPost();
	}, [id]);

	if (loading) return <div className="blog-page">Cargando post...</div>;
	if (error) return <div className="blog-page blog-page__error">{error}</div>;
	if (!post) return <div className="blog-page">Post no encontrado.</div>;

	return (
		<main className="blog-page blog-detail">
			<Link className="blog-detail__back" to="/blog">
				Volver al blog
			</Link>
			<article>
				<header className="blog-page__header">
					<h1>{post.nombre}</h1>
					<p>
						{post.autor || post.usuario?.nombre || "Sushi App"} -{" "}
						{new Date(post.fecha).toLocaleDateString()}
					</p>
				</header>
				<div className="blog-detail__content">
					<ReactMarkdown>{post.contenido}</ReactMarkdown>
				</div>
			</article>
		</main>
	);
}
