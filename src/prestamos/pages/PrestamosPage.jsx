import React, { useEffect, useState } from "react";
import { LabeledInput } from "../../components/LabeledInput";
import { Button } from "../../components/Button";
import { useForm } from "react-hook-form";
import { Modal } from "../../components/Modal";
import { CrearClienteForm } from "../components/CreateClientModal";
import { useClient } from "../hooks/useClient";
import Swal from "sweetalert2";
import { useLoan } from "../hooks/useLoan";
import { RegisterTableLayout } from "../../layout/RegisterTableLayout";
import { useNavigate } from "react-router";

export const PrestamosPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { createLoan, error, loading } = useLoan();
  const { createClient, getClients } = useClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState(clients);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log(data);
    const loan = await createLoan(data);
    if (loan) {
      Swal.fire({
        title: "Préstamo registrado",
        text: "El préstamo ha sido registrado exitosamente",
        icon: "success",
      });
      setTimeout(() => {
        navigate(`/prestamo/${loan.prestamo[0].id}`);
      }, 2000);
    }
  };
  //buscador local de clientes
  const handleClientSearch = (e) => {
    const search = e.target.value.toLowerCase();
    setFilteredClients(
      clients.filter((client) => client.nombre.toLowerCase().includes(search))
    );
  };

  const handleCreateClient = async (newClient) => {
    const client = await createClient(newClient);
    if (client) {
      Swal.fire({
        title: "Cliente registrado",
        text: "El cliente ha sido registrado exitosamente",
        icon: "success",
      });
      setClients((prev) => [...prev, client.cliente]);
      setFilteredClients((prev) => [...prev, client.cliente]);
      reset();
    }
    setIsModalOpen(false);
  };
  const handleNavigate = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getClients(1, 1000);
        if (data && data.clientes) {
          setClients(data.clientes); // Asegúrate de acceder al nivel correcto.
          setFilteredClients(data.clientes); // Sincronizar también `filteredClients`.
        }
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };
    fetchUsers();
    setValue("fecha_inicio", new Date().toISOString().split("T")[0]);
  }, []);

  return (
    <RegisterTableLayout title="Registrar Préstamo">
      {error && (
        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {loading && <p>Cargando...</p>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Select Cliente */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cliente
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar cliente"
                  onChange={handleClientSearch}
                  className="w-full border border-gray-300 rounded-md p-2 mb-2"
                />
                <select
                  {...register("cliente_id", {
                    required: "Seleccione un cliente",
                  })}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  {filteredClients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.nombre} {client.apellido}
                    </option>
                  ))}
                </select>
                {errors.cliente_id && (
                  <p className="text-red-500 text-sm">
                    {errors.cliente_id.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <br />
              <Button
                type="button"
                clase="!w-auto mt-2"
                onClick={() => setIsModalOpen(true)}
              >
                Crear Cliente
              </Button>
            </div>
          </div>

          {/* Select Tipo de Préstamo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Préstamo
            </label>
            <select
              {...register("tipo_prestamo", {
                required: "Seleccione un tipo de préstamo",
              })}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione</option>
              <option value="fijo">Interés Fijo</option>
              <option value="cuota">Capital + Interés</option>
            </select>
            {errors.tipo_prestamo && (
              <p className="text-red-500 text-sm">
                {errors.tipo_prestamo.message}
              </p>
            )}
          </div>

          {/* Campo Monto */}
          <LabeledInput
            label="Monto"
            type="number"
            name="monto"
            register={register}
            require={true}
            error={errors.monto}
            {...register("monto", { required: "El monto es requerido" })}
          />

          {/* Campo Porcentaje a Ganar */}
          <LabeledInput
            label="Porcentaje a Ganar (%)"
            type="number"
            name="tasa_interes"
            register={register}
            require={true}
            error={errors.tasa_interes}
            {...register("tasa_interes", {
              required: "La tasa de interes es requerido",
            })}
          />

          {/* Fecha */}
          <LabeledInput
            label="Fecha de Inicio"
            type="date"
            name="fecha_inicio"
            register={register}
            require={true}
            error={errors.fecha_inicio}
            {...register("fecha_inicio", { required: "La fecha es requerida" })}
          />

          {/* Frequencia de pagos */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Frecuencia de pago
            </label>
            <select
              {...register("frecuencia_pago", {
                required: "Seleccione un tipo de préstamo",
              })}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Seleccione</option>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
            {errors.frecuencia_pago && (
              <p className="text-red-500 text-sm">
                {errors.frecuencia_pago.message}
              </p>
            )}
          </div>

          {/* Cuotas */}
          <LabeledInput
            label="Cuotas"
            type="number"
            name="total_cuotas"
            register={register}
            require={true}
            error={errors.total_cuotas}
            {...register("total_cuotas", {
              required: "Las cuotas es requerido",
            })}
          />
        </div>

        {/* Textarea Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Documento
          </label>
          <textarea
            {...register("documento", {
              required: "La documento es requerida",
            })}
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
            placeholder="Ingrese una descripción del documento"
          ></textarea>
          {errors.documento && (
            <p className="text-red-500 text-sm">{errors.documento.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <Button clase="!w-auto" type="submit">
            Registrar
          </Button>
          <Button
            clase="!w-auto !bg-gray-500 hover:!bg-gray-600"
            type="button"
            onClick={() => handleNavigate("/listado/prestamos")}
          >
            Cancelar
          </Button>
        </div>
      </form>

      {/* Modal para Crear Cliente */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Cliente"
        >
          <CrearClienteForm onCreate={handleCreateClient} />
        </Modal>
      )}
    </RegisterTableLayout>
  );
};
