import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContex"
import { roles } from "../common/constans"
import Swal from "sweetalert2"

const Sidebar = () => {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const handleLogout = () => {

        Swal.fire({
            title: "Esta seguro de cerrar sesion?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si!",
            cancelButtonText: "No!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                localStorage.clear()
                navigate("/auth/login")
            }
        });

    }

    return (
        <>
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-800 z-20 flex items-center px-4 overflow-auto">
                <button className="text-white" onClick={toggleSidebar}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <div className="flex-grow flex justify-center">
                    <img
                        src="/images/HATRIA_SIN_FONDO_BLANCO.png"
                        alt="logo"
                        className="w-auto object-contain rounded-lg"
                    />
                </div>
            </div>
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={toggleSidebar}></div>}
            <div
                className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed left-0 top-0 z-20 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                <div className="hidden md:flex justify-end mb-6">
                    <div className="w-full h-44 relative">
                        <img
                            src="/images/HATRIA_SIN_FONDO_BLANCO.png"
                            alt="logo"
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                        <div
                            className="absolute inset-0 shadow-lg rounded-lg border-white "
                        ></div>
                    </div>
                </div>
                <h2 className="text-2xl font-semibold mb-6">Hola {user.name}</h2>
                <nav>
                    <ul className="space-y-2">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) => `block p-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}
                            >
                                Inicio
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/perfil"
                                className={({ isActive }) => `block p-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}
                            >
                                Perfil
                            </NavLink>
                        </li>
                        {(user.rol === roles.Admin || user.rol === roles.SuperAdmin) && (
                            <li>
                                <NavLink
                                    to="/clientes"
                                    className={({ isActive }) => `block p-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}
                                >
                                    Clientes
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink
                                to="/listado/prestamos"
                                className={({ isActive }) => `block p-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}
                            >
                                Prestamos
                            </NavLink>
                        </li>
                        {(user.rol === roles.Admin || user.rol === roles.SuperAdmin) && (
                            <li>
                                <NavLink
                                    to="/usuarios"
                                    className={({ isActive }) => `block p-2 rounded-lg ${isActive ? "bg-gray-700" : "hover:bg-gray-700"}`}
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="mt-2 bottom-4 left-4 right-4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center"
                >
                    <LogOut size={18} className="mr-2" />
                    Cerrar sesión
                </button>
            </div>
        </>
    )
}

export default Sidebar