import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

export default function Cart() {
	const { cartItems, removeFromCart, total, clearCart } = useCart();
	const { token } = useAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [mensaje, setMensaje] = useState(null);

	const handlePagar = async () => {
		if (!token) {
			alert("Debes iniciar sesion para realizar una compra");
			navigate("/login");
			return;
		}

		setLoading(true);
		setMensaje(null);

		try {
			const response = await fetch(
				"http://localhost:3000/api/pedidos/checkout",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ items: cartItems }),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.mensaje || "Error al procesar el pago");
			}

			clearCart();
			setMensaje("Compra simulada con exito. Tu sushi esta en preparacion.");
			setTimeout(() => navigate("/menu"), 3000);
		} catch (error) {
			alert(error.message);
		} finally {
			setLoading(false);
		}
	};

	if (cartItems.length === 0) {
		return (
			<div
				className="cart-empty"
				style={{ textAlign: "center", marginTop: "50px" }}
			>
				{mensaje ? (
					<h2 style={{ color: "green" }}>{mensaje}</h2>
				) : (
					<h2>Tu carrito esta vacio</h2>
				)}
				<button type="button" onClick={() => navigate("/menu")}>
					Ir al Menu
				</button>
			</div>
		);
	}

	return (
		<div className="cart-container">
			<h2>Tu Pedido</h2>

			{mensaje && (
				<div
					style={{ color: "green", marginBottom: "20px", fontWeight: "bold" }}
				>
					{mensaje}
				</div>
			)}

			<div className="cart-items">
				{cartItems.map((item) => (
					<div key={item.id} className="cart-item">
						<img src={item.image} alt={item.nombre} width="50" />
						<div className="item-details">
							<h4>{item.nombre}</h4>
							<p>Cantidad: {item.cantidad}</p>
							<p>Subtotal: ${(item.precio * item.cantidad).toFixed(2)}</p>
						</div>
						<button
							type="button"
							className="remove-btn"
							onClick={() => removeFromCart(item.id)}
						>
							Quitar
						</button>
					</div>
				))}
			</div>

			<div className="cart-summary">
				<h3>Total a Pagar: ${total.toFixed(2)}</h3>
				<button
					type="button"
					className="checkout-btn"
					onClick={handlePagar}
					disabled={loading}
				>
					{loading ? "Procesando Pago..." : "Proceder al Pago"}
				</button>
				<button
					type="button"
					className="clear-btn"
					onClick={clearCart}
					disabled={loading}
				>
					Vaciar Carrito
				</button>
			</div>
		</div>
	);
}
