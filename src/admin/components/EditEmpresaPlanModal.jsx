import React, { useEffect, useState, useRef } from "react";
import { Button } from "../../components/Button";
import Swal from "sweetalert2";
import { useAdmin } from "../hooks/useAdmin";

export const EditEmpresaPlanModal = ({ planes, closeModal, empresa, handleUpdateEmpresa }) => {
    const { updatePlan, loading, error } = useAdmin();

    const [formData, setFormData] = useState({
        plan_id: empresa.plan_id || "",
        dias: empresa.duracion_dias || 0,
        estado: empresa.estado_empresa_plan || "activo",
    });

    const formRef = useRef(null);

    useEffect(() => {
        setFormData({
            plan_id: empresa.plan_id,
            dias: empresa.duracion_dias,
            estado: empresa.estado_empresa_plan,
        });
    }, [empresa]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "plan_id") {
            const selectedPlan = planes.find((plan) => plan.id === value);
            if (selectedPlan) {
                setFormData((prev) => ({
                    ...prev,
                    dias: selectedPlan.duracion_dias,
                }));
            }
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const payload = {
            id: empresa.id,
            ...formData,
        };
        const plan = await updatePlan(payload);
        if (plan) {
            Swal.fire({
                title: "Plan actualizado",
                text: "El Plan ha sido actualizado exitosamente",
                icon: "success",
            });
            console.log(plan)
            closeModal();
            handleUpdateEmpresa({ ...payload, fecha_inicio: plan.empresa.fecha_inicio, fecha_fin: plan.empresa.fecha_fin });
        }
    };

    return (
        <div ref={formRef}>
            {error && (
                <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}
            {loading && <p>Cargando...</p>}
            <h1>Empresa: {empresa.nombre}</h1>
            <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de planes
                </label>
                <select
                    name="plan_id"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.plan_id}
                    onChange={handleChange}
                >
                    {planes.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                            {plan.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Días</label>
                <input
                    min={7}
                    name="dias"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="Ingrese los días"
                    value={formData.dias}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del plan
                </label>
                <select
                    name="estado"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={formData.estado}
                    onChange={handleChange}
                >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                </select>
            </div>
            <div className="flex justify-end gap-4 mt-8">
                <Button
                    clase="!bg-gray-500 hover:!bg-gray-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => closeModal(false)}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleSubmit}
                    clase="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                >
                    Aceptar
                </Button>
            </div>
        </div>
    );
};
