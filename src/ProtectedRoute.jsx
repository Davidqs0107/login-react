import React, { useEffect } from 'react'
import { useAuth } from './context/AuthContex'
import { Navigate, Outlet } from 'react-router';
import { PrestamoLayout } from './prestamos/layout/PrestamoLayout';

export const ProtectedRoute = () => {
    const { isLoading, isAuthenticated, checkAuthToken, user } = useAuth();
    useEffect(() => {
        checkAuthToken();
    }, []);
    if (isLoading) {
        return <h1>Cargando...</h1>
    }
    if (!isAuthenticated) {

        return <Navigate to="/auth/login" replace />
    }
    return (
        <PrestamoLayout rol={user.rol} >
            <Outlet />
        </PrestamoLayout>
    )
}
