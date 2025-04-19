import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Si está cargando, muestra un indicador de carga
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }

  // Si está autenticado, renderiza las rutas hijas (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;