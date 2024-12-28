import React from 'react'
import Sidebar from '../../components/SideBar'

export const PrestamoLayout = ({ children }) => {
    return (
        <div className='flex flex-col md:flex-row'>
            <Sidebar />
            <main className='flex-1 p-4 md:ml-64 transition-all duration-300 ease-in-out mt-4'>
                {children}
            </main>
        </div>
    )
}
