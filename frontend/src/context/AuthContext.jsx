/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const API_URL = 'http://localhost:3000/api';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
  }, []);

  const cargarPerfil = useCallback(async (tokenActual) => {
    if (!tokenActual) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${tokenActual}` },
      });

      if (!response.ok) {
        throw new Error('Sesion invalida');
      }

      const data = await response.json();
      setUsuario(data.usuario);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
    } catch (error) {
      console.warn('No se pudo validar la sesion', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    cargarPerfil(token);
  }, [cargarPerfil, token]);

  const login = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setToken(data.token);
    setUsuario(data.usuario);
  }, []);

  const value = useMemo(() => ({
    usuario,
    token,
    loading,
    isAuthenticated: Boolean(token && usuario),
    isAdmin: usuario?.rol === 'ADMINISTRADOR',
    login,
    logout,
  }), [usuario, token, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
