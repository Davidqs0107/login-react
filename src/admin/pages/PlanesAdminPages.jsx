import React, { useEffect, useState } from "react";
import { RegisterTableLayout } from "../../layout/RegisterTableLayout";
import { useAdmin } from "../hooks/useAdmin";
import { Button } from "../../components/Button";
import { Modal } from "../../components/Modal";
import { LoaderLocal } from "../../components/LoaderLocal";
import Swal from "sweetalert2";

export const PlanesAdminPages = () => {
    const { getPlanes, updatePlanMaxUsuarios, loading, error } = useAdmin();
    const [planes, setPlanes] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [maxUsuariosInput, setMaxUsuariosInput] = useState("");

    const loadPlanes = async () => {
        const result = await getPlanes();
        if (result) {
            setPlanes(result.planes);
        }
    };

    useEffect(() => {
        loadPlanes();
    }, []);

    const handleEditPlan = (plan) => {
        setSelectedPlan(plan);
        setMaxUsuariosInput(plan.max_usuarios !== null ? String(plan.max_usuarios) : "");
        setIsEditModalOpen(true);
    };

    const handleSaveMaxUsuarios = async () => {
        const maxUsuarios = maxUsuariosInput === "" ? null : parseInt(maxUsuariosInput);
        if (maxUsuarios !== null && (isNaN(maxUsuarios) || maxUsuarios < 1)) {
            Swal.fire({
                icon: "error",
                title: "Valor inválido",
                text: "Ingrese un número mayor a 0 o deje vacío para ilimitado",
            });
            return;
        }
        const result = await updatePlanMaxUsuarios(selectedPlan.id, maxUsuarios);
        if (result) {
            Swal.fire({
                icon: "success",
                title: "Plan actualizado",
                text: `Límite de usuarios actualizado para ${selectedPlan.nombre}`,
            });
            setIsEditModalOpen(false);
            loadPlanes();
        }
    };

    return (
        <RegisterTableLayout title="Planes">
            {error && (
                <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
            {loading && <LoaderLocal />}

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Planes configurados</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Configure la cantidad máxima de usuarios (cobradores) que cada plan permite.
                    Déjeselo vacío para permitir usuarios ilimitados.
                </p>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Duración (días)
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Precio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Máx. Usuarios
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {planes.map((plan) => (
                                <tr key={plan.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {plan.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {plan.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {plan.duracion_dias}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {plan.precio ? `$${plan.precio}` : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {plan.max_usuarios !== null ? (
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                                {plan.max_usuarios} usuarios
                                            </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                                Ilimitado
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Button
                                            clase="!bg-blue-500 hover:!bg-blue-600 text-white text-xs py-1 px-3 rounded"
                                            onClick={() => handleEditPlan(plan)}
                                        >
                                            Editar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isEditModalOpen && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title={`Editar: ${selectedPlan?.nombre}`}
                >
                    <div className="p-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Configure el límite máximo de usuarios cobradores para este plan.
                            Déjeselo vacío para permitir usuarios ilimitados.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Máximo de usuarios
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full border border-gray-300 rounded-md p-2"
                                placeholder="Vacío = ilimitado"
                                value={maxUsuariosInput}
                                onChange={(e) => setMaxUsuariosInput(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                clase="!bg-gray-500 hover:!bg-gray-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSaveMaxUsuarios}
                                clase="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                disabled={loading}
                            >
                                Guardar
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </RegisterTableLayout>
    );
};