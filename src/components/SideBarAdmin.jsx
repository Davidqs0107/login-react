import { LogOut, Menu, X } from 'lucide-react';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContex';

const SidebarAdmin = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {

        localStorage.clear();
        navigate('/auth/login');
    };
    return (
        <>
            <div className="md:hidden  top-0 left-0 right-0 h-16 bg-gray-800 z-20 flex items-center px-4">
                <button
                    className="text-white"
                    onClick={toggleSidebar}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            <div className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed left-0 top-0 z-20 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}>
                <h2 className="text-2xl font-semibold mb-6">Hola {user.name}</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `block p-2 rounded-lg ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                                }
                            >
                                Inicio
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/admin/empresas"
                                className={({ isActive }) =>
                                    `block p-2 rounded-lg ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                                }
                            >
                                Empresas
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="absolute bottom-4 left-4 right-4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                    <LogOut size={18} className="mr-2" />
                    Cerrar sesión
                </button>
            </div>

        </>
    );
};

export default SidebarAdmin;

