import React from 'react'

export const RegisterTableLayout = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            </header>
            {children}
        </div>
    )
}
