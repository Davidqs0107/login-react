import React from 'react'
import { AppRouter } from './routes/AppRouter'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContex'
import { ConfigProvider } from './context/ConfigContext'

export const LoginApp = () => {
    return (
        <AuthProvider>
            <ConfigProvider>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </ConfigProvider>
        </AuthProvider>

    )
}
