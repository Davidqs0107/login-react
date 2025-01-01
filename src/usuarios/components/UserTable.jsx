import { UserRoundPen, UserRoundX } from "lucide-react";
import React from "react";

export const UsersTable = ({ users = [], onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto mt-6">
            <table className="hidden sm:table min-w-full table-auto border-collapse border border-gray-200 text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                        <th className="px-4 py-2 border border-gray-200">Nombre</th>
                        <th className="px-4 py-2 border border-gray-200">Apellido</th>
                        <th className="px-4 py-2 border border-gray-200">CI</th>
                        <th className="px-4 py-2 border border-gray-200">Telefono</th>
                        <th className="px-4 py-2 border border-gray-200">Email</th>
                        <th className="px-4 py-2 border border-gray-200">Rol</th>
                        <th className="px-4 py-2 border border-gray-200">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                            <td className="px-4 py-2 border border-gray-200">{user.nombre}</td>
                            <td className="px-4 py-2 border border-gray-200">{user.apellido}</td>
                            <td className="px-4 py-2 border border-gray-200">{user.ci}</td>
                            <td className="px-4 py-2 border border-gray-200">{user.telefono}</td>
                            <td className="px-4 py-2 border border-gray-200">{user.email}</td>
                            <td className="px-4 py-2 border border-gray-200">{user.rol}</td>
                            <td className="px-4 py-2 border border-gray-200">
                                <button
                                    className="text-blue-500 hover:underline mr-2"
                                    onClick={() => onEdit(user)}
                                >
                                    <UserRoundPen />
                                </button>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => onDelete(user.id)}
                                >
                                    <UserRoundX />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="block sm:hidden">
                {users.map((user) => (
                    <div key={user.id} className="border border-gray-200 p-4 mb-4 rounded-lg">
                        <div className="flex justify-between">
                            <span className="font-bold">Nombre:</span>
                            <span>{user.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Email:</span>
                            <span>{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Rol:</span>
                            <span>{user.rol}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <button
                                className="text-blue-500 hover:underline mr-2"
                                onClick={() => onEdit(user)}
                            >
                                <UserRoundPen />
                            </button>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => onDelete(user.id)}
                            >
                                <UserRoundX />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};
