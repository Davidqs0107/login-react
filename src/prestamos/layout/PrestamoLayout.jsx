import React from 'react'
import Sidebar from '../../components/SideBar'
import { roles } from '../../common/constans'
import SidebarAdmin from '../../components/SideBarAdmin'
import { SuscripcionBanner } from '../../suscripciones/components/SuscripcionBanner'

export const PrestamoLayout = ({ children, rol }) => {
    const esSuperAdmin = rol === roles.SuperAdmin;
    return (
        <div className='flex flex-col md:flex-row'>

            {!esSuperAdmin ? (<Sidebar />) : (<SidebarAdmin />)}
            <main className='flex-1 p-4 md:ml-64 transition-all duration-300 ease-in-out mt-8'>
                {!esSuperAdmin && <SuscripcionBanner />}
                {children}
            </main>
        </div>
    )
}
