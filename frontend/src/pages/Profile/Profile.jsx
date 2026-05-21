import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

export default function Profile() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
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
          {usuario.telefono && (
            <div className="info-group">
              <span className="info-label">Telefono:</span>
              <span className="info-value">{usuario.telefono}</span>
            </div>
          )}
          {usuario.direccion && (
            <div className="info-group">
              <span className="info-label">Direccion:</span>
              <span className="info-value">{usuario.direccion}</span>
            </div>
          )}
          <div className="info-group">
            <span className="info-label">Rol:</span>
            <span className="info-value">
              {usuario.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Cerrar Sesion
        </button>
      </div>
    </div>
  );
}
