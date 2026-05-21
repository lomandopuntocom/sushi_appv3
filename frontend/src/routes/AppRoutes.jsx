// frontend/src/routes/AppRoutes.jsx
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminBlog from '../pages/AdminBlog/AdminBlog';
import AdminCatalog from '../pages/AdminCatalog/AdminCatalog';
import BlogDetail from '../pages/Blog/BlogDetail';
import BlogList from '../pages/Blog/BlogList';
import Cart from '../pages/Cart/Cart';
import Login from '../pages/Login/Login';
import Menu from '../pages/Menu/Menu';
import Profile from '../pages/Profile/Profile';
import Register from '../pages/Register/Register';
import { AdminRoute, ProtectedRoute } from './ProtectedRoute';

function AdminHome() {
  return (
    <div style={{ padding: '24px' }}>
      <h2>Panel de Administrador</h2>
      <p>Desde aqui se administra el catalogo de platillos y los posts del blog.</p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/admin/catalogo">Administrar catalogo</Link>
        <Link to="/admin/blog">Administrar blog</Link>
      </div>
    </div>
  );
}

function NavigationAndRoutes() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <>
      <nav style={{ padding: '20px', background: '#f8f8f8', display: 'flex', gap: '15px' }}>
        <Link to="/menu">Menu</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/carrito">Carrito</Link>
        {isAuthenticated ? (
          <>
            <Link to="/perfil">Perfil</Link>
            {isAdmin && (
              <>
                <Link to="/admin">Admin</Link>
                <Link to="/admin/catalogo">Catalogo</Link>
                <Link to="/admin/blog">Posts</Link>
              </>
            )}
            <button type="button" onClick={logout}>Cerrar sesion</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/carrito" element={<Cart />} />
          <Route path="/perfil" element={<Profile />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/admin/catalogo" element={<AdminCatalog />} />
          <Route path="/admin/blog" element={<AdminBlog />} />
        </Route>
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
