import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import "./Menu.css";

export default function Menu() {
	const [platos, setPlatos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { addToCart } = useCart();

	useEffect(() => {
		const fetchMenu = async () => {
			try {
				const response = await fetch("http://localhost:3000/api/menu");
				if (!response.ok) throw new Error("No se pudo cargar el menú");
				const data = await response.json();
				setPlatos(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchMenu();
	}, []);

	if (loading) return <div className="loading">Cargando Platillos...</div>;
	if (error) return <div className="error">Error: {error}</div>;

	return (
		<div className="menu-section">
			<h2 style={{ textAlign: "center", marginTop: "20px" }}>Nuestro Menú</h2>

			<div className="menu-grid">
				{platos.map((plato) => (
					<div key={plato.id} className="menu-card">
						<img src={plato.image} alt={plato.nombre} className="menu-image" />
						<div className="menu-info">
							<h3>{plato.nombre}</h3>
							<p className="category-tag">{plato.categoria?.nombre}</p>
							<p>{plato.descripcion}</p>
							<p className="menu-price">
								${parseFloat(plato.precio).toFixed(2)}
							</p>
							<button
								type="button"
								className="add-to-cart-btn"
								onClick={() => addToCart(plato)}
							>
								Agregar al Carrito
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
