import React from "react";

export const ClientsTable = ({ clients = [], meta, onPageChange, onEdit, onDelete }) => {
    const { page, totalPages } = meta;
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
                        <th className="px-4 py-2 border border-gray-200">Direccion</th>
                        <th className="px-4 py-2 border border-gray-200">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                            <td className="px-4 py-2 border border-gray-200">{client.nombre}</td>
                            <td className="px-4 py-2 border border-gray-200">{client.apellido}</td>
                            <td className="px-4 py-2 border border-gray-200">{client.ci}</td>
                            <td className="px-4 py-2 border border-gray-200">{client.telefono}</td>
                            <td className="px-4 py-2 border border-gray-200">{client.email}</td>
                            <td className="px-4 py-2 border border-gray-200">{client.direccion}</td>
                            <td className="px-4 py-2 border border-gray-200">
                                <button
                                    className="text-blue-500 hover:underline mr-2"
                                    onClick={() => onEdit(client)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => onDelete(client.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                <button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span className="px-4 py-2">{`${page} de ${totalPages}`}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
            <div className="block sm:hidden">
                {clients.map((client) => (
                    <div key={client.id} className="border border-gray-200 p-4 mb-4 rounded-lg">
                        <div className="flex justify-between">
                            <span className="font-bold">Nombre:</span>
                            <span>{client.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Email:</span>
                            <span>{client.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-bold">Direccion:</span>
                            <span>{client.direccion}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <button
                                className="text-blue-500 hover:underline mr-2"
                                onClick={() => onEdit(client)}
                            >
                                Editar
                            </button>
                            <button
                                className="text-red-500 hover:underline"
                                onClick={() => onDelete(client.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};
