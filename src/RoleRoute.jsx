import React from 'react'
import { useAuth } from './context/AuthContex'
import { Navigate, Outlet } from 'react-router';

/** Deja pasar solo a los roles indicados; el resto redirige al inicio. */
export const RoleRoute = ({ roles }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <h1>Cargando...</h1>
    }
    return roles.includes(user?.rol) ? <Outlet /> : <Navigate to="/" replace />;
}
