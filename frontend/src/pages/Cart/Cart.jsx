import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

export default function Cart() {
  // 1. TODOS los hooks van aquí arriba (Nivel más alto)
  const { cartItems, removeFromCart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // 2. Funciones normales van abajo
  const handlePagar = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Debes iniciar sesión para realizar una compra');
      navigate('/login');
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      const response = await fetch('http://localhost:3000/api/pedidos/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ items: cartItems })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Error al procesar el pago');
      }

      clearCart();
      setMensaje('🎉 ¡Compra simulada con éxito! Tu sushi está en preparación.');
      
      setTimeout(() => navigate('/menu'), 3000);

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // Volvemos a apagar el estado de carga
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty" style={{ textAlign: 'center', marginTop: '50px' }}>
        {mensaje ? <h2 style={{ color: 'green' }}>{mensaje}</h2> : <h2>Tu carrito está vacío</h2>}
        <button onClick={() => navigate('/menu')}>Ir al Menú</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Tu Pedido</h2>
      
      {/* Mostramos el mensaje de éxito si existe */}
      {mensaje && <div style={{ color: 'green', marginBottom: '20px', fontWeight: 'bold' }}>{mensaje}</div>}

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
          className="checkout-btn" 
          onClick={handlePagar} 
          disabled={loading} // Bloqueamos el botón mientras carga
        >
          {loading ? 'Procesando Pago...' : 'Proceder al Pago'}
        </button>
        <button className="clear-btn" onClick={clearCart} disabled={loading}>
          Vaciar Carrito
        </button>
      </div>
    </div>
  );
}