import React, { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { usePago } from '../hooks/usePago';
import Swal from 'sweetalert2';
import { formatDateWithDateFns } from '../../common/functions';

export const CreateCuotaModal = ({ closeModal, cuota, updatedCuota, onlyRead }) => {
    const { id: cuotaId } = cuota;
    const { getPagosCuotaById, createPago, error, loading } = usePago();
    const [pagos, setPagos] = useState([]);

    const onSubmit = async () => {
        const monto = document.querySelector('input[name="monto"]').value;
        const tipo_pago = document.querySelector('select[name="tipo_pago"]').value;
        if (!monto) {
            return;
        }
        const payload = {
            monto,
            tipo_pago,
            cuota_id: cuotaId,
            fecha_pago: formatDateWithDateFns(new Date())
        }

        const pago = await createPago(payload);
        if (pago) {
            Swal.fire({
                title: "Pago registrado",
                text: pago.msg || "El Pago ha sido registrado exitosamente",
                icon: "success"
            });
            const pagoFormatted = {
                fecha_pago: payload.fecha_pago,
                id: pago.pagoId,
                monto
            }
            setPagos((prev) => [...prev, pagoFormatted]);
            console.log(pago)
            cuota.monto_pagado = parseFloat(pago.cuotaActualizada.monto_pagado);
            cuota.estado = pago.cuotaActualizada.estado;
            updatedCuota(cuota);
        }
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getPagosCuotaById(cuotaId);
                if (data && data.pagos) {
                    setPagos(data.pagos);
                }
            } catch (error) {
                console.error("Error al obtener los pagos:", error);
            }
        };
        fetchUsers();
        return () => { };

    }, [cuotaId]);
    return (
        <>
            <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold">Pagos Parciales</h3>
                <table className="min-w-full bg-white border border-gray-300 rounded-lg mb-4">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Monto</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tipo pago</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Puedes agregar pagos parciales aquí */}
                        {pagos.map(pago => (
                            <tr key={pago.id} className="border-t">
                                <>
                                    <td className="px-4 py-2">{new Date(pago.fecha_pago).toISOString().split('T')[0]}</td>
                                    <td className="px-4 py-2">{pago.monto}</td>
                                    <td className="px-4 py-2">{pago.tipo_pago}</td>
                                </>

                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                    !onlyRead && <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monto a Pagar</label>
                            <input
                                min={1}
                                name='monto'
                                type="number"
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Ingrese el monto"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de pago</label>
                            <select
                                name='tipo_pago'
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="efectivo">Efectivo</option>
                                <option value="qr">QR</option>
                            </select>
                        </div>
                    </>
                }


                <div className="flex justify-end gap-4">
                    <Button
                        clase="!bg-gray-500 hover:!bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        onClick={() => closeModal(false)}
                    >
                        Cancelar
                    </Button>
                    {!onlyRead && <Button
                        onClick={onSubmit}
                        clase="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Confirmar Pago
                    </Button>}
                </div>
            </div>
        </>
    )
}
