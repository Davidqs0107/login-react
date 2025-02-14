import React from 'react'
import { formatDateWithDateFns } from '../../common/functions'
import { Eye } from 'lucide-react'
import { roles } from '../../common/constans'
import Swal from 'sweetalert2'

export const DescargosTable = ({ descargos = [], rol, aprobar }) => {
    const handleOpenModal = (descargo) => {
        //aprobar descargo
        Swal.fire({
            title: 'Descargo',
            html: `
                <p><strong>Nombre:</strong> ${descargo.nombre}</p>
                <p><strong>Apellido:</strong> ${descargo.apellido}</p>
                <p><strong>CI:</strong> ${descargo.ci}</p>
                <p><strong>Telefono:</strong> ${descargo.telefono}</p>
                <p><strong>Email:</strong> ${descargo.email}</p>
                <p><strong>Tipo de pago:</strong> ${descargo.tipo_pago}</p>
                <p><strong>Monto:</strong> ${descargo.monto}</p>
                <p><strong>Nota:</strong> ${descargo.nota}</p>
                <p><strong>Fecha:</strong> ${formatDateWithDateFns(descargo.fecha)}</p>
                <p><strong>Estado:</strong> ${descargo.estado}</p>
            `,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Aprobar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
        }).then((result) => {
            if (result.isConfirmed) {
                const payload = {
                    id: descargo.id,
                }
                aprobar(payload);
            }
        })
    }
    return (
        <>
            <div className="overflow-x-auto mt-6">
                <table className=" min-w-full table-auto border-collapse border border-gray-200 text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                            {rol === roles.Admin && (
                                <>
                                    <th className="px-4 py-2 border border-gray-200">Nombre</th>
                                    <th className="px-4 py-2 border border-gray-200">Apellido</th>
                                    <th className="px-4 py-2 border border-gray-200">CI</th>
                                    <th className="px-4 py-2 border border-gray-200">Telefono</th>
                                    <th className="px-4 py-2 border border-gray-200">Email</th>
                                </>
                            )}
                            <th className="px-4 py-2 border border-gray-200">Tipo pago</th>
                            <th className="px-4 py-2 border border-gray-200">Monto</th>
                            <th className="px-4 py-2 border border-gray-200">Nota</th>
                            <th className="px-4 py-2 border border-gray-200">Fecha</th>
                            <th className="px-4 py-2 border border-gray-200">Estado</th>
                            {rol == roles.Admin && (<th className="px-4 py-2 border border-gray-200">Acciones</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {descargos.map((descargo) => (
                            <tr key={descargo.id} className="odd:bg-gray-50 even:bg-white hover:bg-gray-100">
                                {rol === roles.Admin && (
                                    <>
                                        <td className="px-4 py-2 border border-gray-200">{descargo?.nombre}</td>
                                        <td className="px-4 py-2 border border-gray-200">{descargo?.apellido}</td>
                                        <td className="px-4 py-2 border border-gray-200">{descargo?.ci}</td>
                                        <td className="px-4 py-2 border border-gray-200">{descargo?.telefono}</td>
                                        <td className="px-4 py-2 border border-gray-200">{descargo?.email}</td>
                                    </>
                                )}
                                <td className="px-4 py-2 border border-gray-200">{descargo.tipo_pago}</td>
                                <td className="px-4 py-2 border border-gray-200">{descargo.monto}</td>
                                <td className="px-4 py-2 border border-gray-200">{descargo.nota}</td>
                                <td className="px-4 py-2 border border-gray-200">{formatDateWithDateFns(descargo.fecha)}</td>
                                <td className="px-4 py-2 border border-gray-200">{descargo.estado}</td>
                                {(rol == roles.Admin && descargo.estado === 'pendiente') && (<td className="px-4 py-2 border border-gray-200">
                                    <button
                                        title="Editar documento"
                                        className="text-blue-500 hover:underline mr-2"
                                        onClick={() => handleOpenModal(descargo)}
                                    >
                                        <Eye />
                                    </button>

                                </td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
