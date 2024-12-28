import React, { useEffect, useState } from "react";
import { Modal } from "../../components/Modal"; // Importa tu componente Modal
import { Button } from "../../components/Button"; // Botón reutilizable
import { useForm } from "react-hook-form";
import { useLoan } from "../hooks/useLoan";
import { useParams } from "react-router";
import { CreateCuotaModal } from "../components/CreateCuotaModal";

export const DetallePrestamoPage = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const { getLoanById, error, loading } = useLoan();
    const { id: prestamoId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCuota, setSelectedCuota] = useState(null);
    const [prestamo, setPrestamo] = useState({});
    const [cuotas, setCuotas] = useState([]);

    const handlePagarCuota = (cuota) => {
        setSelectedCuota(cuota);
        setIsModalOpen(true);
    };
    const handleUpdateCuota = (cuota) => {

        setCuotas((prev) => prev.map((c) => (c.id === cuota.id ? { ...c, ...cuota } : c)));
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getLoanById(prestamoId, true);
                if (data && data.prestamo) {
                    setPrestamo(data.prestamo); // Asegúrate de acceder al nivel correcto.
                    setCuotas(data.prestamo?.cuotas || []); // Asegúrate de acceder al nivel correcto.
                }
            } catch (error) {
                console.error("Error al obtener los clientes:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Encabezado */}
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Detalle del Préstamo</h1>
            </header>

            {/* Información Principal */}
            <section className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-white rounded-lg shadow">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Información del Cliente</h2>
                        <p><strong>Nombre:</strong> {prestamo.nombre} {prestamo.apellido}</p>
                        <p><strong>Email:</strong> {prestamo.email}</p>
                        <p><strong>Dirección:</strong> {prestamo.direccion}</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Detalles del Préstamo</h2>
                        <p><strong>Monto:</strong> {prestamo.monto}</p>
                        <p><strong>Tasa de Interés:</strong> {prestamo.tasa_interes}%</p>
                        <p><strong>Frecuencia de Pago:</strong> {prestamo.frecuencia_pago}</p>
                        <p><strong>Total de Cuotas:</strong> {prestamo.total_cuotas}</p>
                        <p><strong>Fecha de Inicio:</strong> {new Date(prestamo.fecha_inicio).toLocaleDateString()}</p>
                    </div>
                </div>
            </section>

            {/* Tabla de Cuotas */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Cuotas</h2>
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">N° Cuota</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Fecha de Pago</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Monto</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Monto Pagado</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Estado</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cuotas.map((cuota, index) => {
                            const isCurrentCuota = index === 0 || cuotas[index - 1]?.estado === "pagada";
                            const isDisabled = cuota.estado === "pagada" || !isCurrentCuota;
                            return <tr key={cuota.id} className="border-t">
                                <td className="px-4 py-2">{cuota.numero_cuota}</td>
                                <td className="px-4 py-2">{new Date(cuota.fecha_pago).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{cuota.monto}</td>
                                <td className="px-4 py-2">{cuota.monto_pagado}</td>
                                <td className="px-4 py-2 capitalize">{cuota.estado}</td>
                                <td className="px-4 py-2">
                                    <Button
                                        clase={`${isDisabled
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-500 hover:bg-blue-700 text-white"
                                            } font-bold py-1 px-3 rounded`}
                                        onClick={() => handlePagarCuota(cuota)}
                                        disabled={isDisabled}
                                    >
                                        {cuota.estado === "pagada" ? "Pagada" : "Pagar"}
                                    </Button>
                                </td>
                            </tr>
                        }
                        )}
                    </tbody>
                </table>
            </section>

            {/* Modal para Pagar Cuota */}
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Pagar Cuota N° ${selectedCuota?.numero_cuota}`}
                >
                    <CreateCuotaModal closeModal={setIsModalOpen} cuota={selectedCuota} updatedCuota={handleUpdateCuota} />
                </Modal>
            )}
        </div>
    );
};
