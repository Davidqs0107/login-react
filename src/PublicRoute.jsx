import React, { useEffect } from 'react'
import { useAuth } from './context/AuthContex'
import { Navigate, Outlet } from 'react-router';

export const PublicRoute = () => {
    const { isLoading, isAuthenticated, checkAuthToken } = useAuth();
    useEffect(() => {
        checkAuthToken();
    }, []);
    if (isLoading) {
        return <h1>Cargando...</h1>
    }
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }
    return (
        <Outlet />
    )
}
