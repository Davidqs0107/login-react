import React, { useEffect, useState } from 'react'
import { useAdmin } from '../hooks/useAdmin';

export const EmpresasUsuariosModal = ({ empresa }) => {
    const { getUsuariosEmpresa, loading, error } = useAdmin();
    const [users, setUsers] = useState([]);

    const estadoUsuario = (estado) => {
        if (estado) return 'Activo';
        return 'Inactivo';
    }
    useEffect(() => {
        const fetchUsers = async () => {
            const { usuarios } = await getUsuariosEmpresa(empresa.id);
            console.log(usuarios.data)
            if (usuarios.data) setUsers(usuarios.data);
        };
        fetchUsers();
    }, []);
    return (
        <div className='overflow-x-auto mt-6'>
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                        <th className="px-4 py-2 border border-gray-200">Nombre</th>
                        <th className="px-4 py-2 border border-gray-200">Email</th>
                        <th className="px-4 py-2 border border-gray-200">Estado</th>
                        <th className="px-4 py-2 border border-gray-200">Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                            <td className="px-4 py-2 border border-gray-200">{user.nombre}</td>
                            <td className="px-4 py-2 border border-gray-200">{user.email}</td>
                            <td className="px-4 py-2 border border-gray-200">{estadoUsuario(user.estado)}</td>
                            <td className="px-4 py-2 border border-gray-200">{user.rol}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
