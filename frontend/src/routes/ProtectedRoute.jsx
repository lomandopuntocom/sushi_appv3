import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
	const { isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return <div style={{ padding: "24px" }}>Validando sesion...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return <Outlet />;
}

export function AdminRoute() {
	const { isAdmin, isAuthenticated, loading } = useAuth();
	const location = useLocation();

	if (loading) {
		return <div style={{ padding: "24px" }}>Validando permisos...</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	if (!isAdmin) {
		return <Navigate to="/perfil" replace />;
	}

	return <Outlet />;
}
