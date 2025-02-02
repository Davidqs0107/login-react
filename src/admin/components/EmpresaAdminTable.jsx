import { Eye, FileInput, FileSearch2, Pencil } from 'lucide-react'
import React from 'react'
import { formatDateWithDateFns } from '../../common/functions'

export const EmpresaAdminTable = ({ empresas, openModal, selectedEmpresa }) => {
    const handleOpenModal = (empresa, modalType) => {
        selectedEmpresa(empresa);
        openModal(modalType);
    }
    return (
        <div className='overflow-x-auto mt-6'>
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                        <th className="px-4 py-2 border border-gray-200">ID</th>
                        <th className="px-4 py-2 border border-gray-200">Nombre</th>
                        <th className="px-4 py-2 border border-gray-200">Fecha inicio</th>
                        <th className="px-4 py-2 border border-gray-200">Fecha fin</th>
                        <th className="hidden">planid</th>
                        <th className="px-4 py-2 border border-gray-200">Plan</th>
                        <th className="px-4 py-2 border border-gray-200">Precio</th>
                        <th className="px-4 py-2 border border-gray-200">Estado</th>
                        <th className="px-4 py-2 border border-gray-200">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((empresa) => (
                        <tr key={empresa.id} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                            <td className="px-4 py-2 border border-gray-200">{empresa.id}</td>
                            <td className="px-4 py-2 border border-gray-200">{empresa.nombre}</td>
                            <td className="px-4 py-2 border border-gray-200">{formatDateWithDateFns(empresa.fecha_inicio)}</td>
                            <td className="px-4 py-2 border border-gray-200">{formatDateWithDateFns(empresa.fecha_fin)}</td>
                            <td className="px-4 py-2 border border-gray-200 hidden">{empresa.plan_id}</td>
                            <td className="px-4 py-2 border border-gray-200">{empresa.nombre_plan}</td>
                            <td className="px-4 py-2 border border-gray-200">{empresa.precio}</td>
                            <td className="px-4 py-2 border border-gray-200">{empresa.estado_empresa_plan}</td>

                            <td className="px-4 py-2 border border-gray-200">
                                <button
                                    title="Ver detalle"
                                    className="text-yellow-500 hover:underline mr-2"
                                    onClick={() => handleOpenModal(empresa, { type: 'plan', title: 'Cambiar plan' })}
                                >
                                    <Pencil />
                                </button>
                                <button
                                    title="Ver usuarios"
                                    className="text-green-500 hover:underline mr-2"
                                    onClick={() => handleOpenModal(empresa, { type: 'usuarios', title: 'Usuarios' })}
                                >
                                    <Eye />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
