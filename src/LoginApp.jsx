import React from 'react'
import { AppRouter } from './routes/AppRouter'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContex'

export const LoginApp = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRouter />
            </BrowserRouter>
        </AuthProvider>

    )
}
