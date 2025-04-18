import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { user, loading, isTokenValid } = useAuth();
  
  // Si está cargando, mostrar un indicador o nada
  if (loading) {
    return <div className="loading">Cargando...</div>;
  }
  
  // Si no hay usuario o el token no es válido, redirigir a login
  if (!user || !isTokenValid()) {
    return <Navigate to="/login" replace />;
  }
  
  // Si hay un usuario autenticado con token válido, renderizar los componentes hijos
  return <Outlet />;
};

export default ProtectedRoute;  