import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Al cargar el componente, obtenemos los datos del usuario desde localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    } else {
      // Si no hay usuario en localStorage, significa que no está logueado
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Para cerrar sesión, eliminamos el token y los datos del usuario
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    // Luego redirigimos a la página de inicio de sesión o al menú principal
    navigate('/login');
  };

  if (!usuario) {
    return <div className="profile-container">Cargando datos...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Mi Perfil</h2>
        <div className="profile-info">
          <div className="info-group">
            <span className="info-label">Nombre:</span>
            <span className="info-value">{usuario.nombre}</span>
          </div>
          <div className="info-group">
            <span className="info-label">Correo:</span>
            <span className="info-value">{usuario.email}</span>
          </div>
          {/* Mostramos teléfono o dirección si el objeto usuario los contiene */}
          {usuario.telefono && (
            <div className="info-group">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{usuario.telefono}</span>
            </div>
          )}
          {usuario.direccion && (
            <div className="info-group">
              <span className="info-label">Dirección:</span>
              <span className="info-value">{usuario.direccion}</span>
            </div>
          )}
          <div className="info-group">
            <span className="info-label">Rol:</span>
            <span className="info-value">{usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}</span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
