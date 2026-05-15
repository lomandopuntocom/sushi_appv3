// frontend/src/routes/AppRoutes.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Menu from '../pages/Menu/Menu';
import Cart from '../pages/Cart/Cart';
import Profile from '../pages/Profile/Profile';

function NavigationAndRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verificamos si hay un token cada vez que cambia la ruta
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <>
      {/* Un Navbar temporal muy básico para que puedas navegar */}
      <nav style={{ padding: '20px', background: '#f8f8f8', display: 'flex', gap: '15px' }}>
        <Link to="/menu">Menú</Link>
        <Link to="/carrito">Carrito</Link>
        {isLoggedIn ? (
          <Link to="/perfil">Perfil</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <NavigationAndRoutes />
    </Router>
  );
}