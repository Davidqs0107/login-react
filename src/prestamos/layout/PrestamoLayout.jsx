import React from 'react'
import Sidebar from '../../components/SideBar'
import { roles } from '../../common/constans'
import SidebarAdmin from '../../components/SideBarAdmin'

export const PrestamoLayout = ({ children, rol }) => {
    return (
        <div className='flex flex-col md:flex-row'>

            {rol !== roles.SuperAdmin ? (<Sidebar />) : (<SidebarAdmin />)}
            <main className='flex-1 p-4 md:ml-64 transition-all duration-300 ease-in-out mt-8'>
                {children}
            </main>
        </div>
    )
}
