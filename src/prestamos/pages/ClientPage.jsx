import React, { useEffect, useState } from "react";
import { LabeledInput } from "../../components/LabeledInput";
import { SelectPais } from "../../components/SelectPais";
import { Button } from "../../components/Button";
import { useForm } from "react-hook-form";
import { formFields } from "../forms/clienteForm";
import { useClient } from "../hooks/useClient";
import Swal from "sweetalert2";
import { ClientsTable } from "../components/ClientTable";
import { RegisterTableLayout } from "../../layout/RegisterTableLayout";
import { MapLeaflet } from "../../components/MapLeaflet";
import { useAuth } from "../../context/AuthContex";
import { LoaderLocal } from "../../components/LoaderLocal";

export const ClientPage = () => {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm();
  // aca se usa el useCliente para comunicarse con la API
  const {
    createClient,
    updateClient,
    deleteClient,
    getClients,
    error,
    loading,
  } = useClient();
  const [clients, setClients] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 1 });
  const [selectedClient, setSelectedClient] = useState(null);
  const [position, setPosition] = useState({});
  const [showMap, setShowMap] = useState(false);
  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      ...position,
    };
    if (selectedClient) {
      payload.id = selectedClient.id;
      const client = await updateClient(payload);
      if (client) {
        setClients((prev) =>
          prev.map((c) =>
            c.id === selectedClient.id ? { ...c, ...payload } : c,
          ),
        );
        Swal.fire({
          title: "Cliente actualizado",
          text: "El cliente ha sido actualizado exitosamente",
          icon: "success",
        });
        reset();
      }
    } else {
      const client = await createClient(payload);
      if (client) {
        Swal.fire({
          title: "Cliente registrado",
          text: "El cliente ha sido registrado exitosamente",
          icon: "success",
        });
        setClients((prev) => [...prev, client.cliente]);
        reset();
      }
    }
    setSelectedClient(null);
  });
  const handleCancel = (e) => {
    e.preventDefault();
    reset();
    setSelectedClient(null);
  };
  const handleEdit = (client) => {
    setSelectedClient(client);
    formFields.forEach((field) => {
      return setValue(field.name, client[field.name]);
    });
    setValue("codigo_pais", client.codigo_pais || "+591");
    clearErrors();
  };
  const handleDelete = async (clientId) => {
    Swal.fire({
      title: "Esta Seguro de eliminar el cliente?",
      text: "Esta accion no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const client = await deleteClient({ id: clientId, estado: false });
        if (client) {
          setClients((prev) => prev.filter((client) => client.id !== clientId));
          Swal.fire({
            title: "Eliminado!",
            text: "El cliente fue eliminado",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Ocurrio un error!",
            text: "El usuario no fue eliminado",
            icon: "error",
          });
        }
      }
    });
  };

  const handlePosition = (position) => {
    console.log(position);
    setPosition({
      latitud: position.lat,
      longitud: position.lng,
    });
  };
  useEffect(() => {
    fetchClients();
  }, []);
  const fetchClients = async (page = 1) => {
    const data = await getClients(page);
    if (data) {
      setClients(data.clientes);
      setMeta(data.meta);
    }
  };
  const handlePageChange = (newPage) => {
    fetchClients(newPage);
  };
  const titleClient = selectedClient ? "Editar Cliente" : "Registro de Cliente";
  return (
    <>
      <RegisterTableLayout title={titleClient}>
        {error && (
          <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        {loading && <LoaderLocal />}
        <form
          className="mt-8 space-y-6 max-w-3xl"
          onSubmit={onSubmit}
        >
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Datos del cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectPais
                name="codigo_pais"
                register={register}
                errors={errors}
                defaultValue={selectedClient?.codigo_pais || "+591"}
                label="Indicativo"
              />
              {formFields.map((field, i) => (
                <div key={i}>
                  <LabeledInput
                    type={field.type}
                    label={field.label}
                    require={field.required}
                    error={errors[field.name]}
                    {...register(field.name, field.validation)}
                  />
                </div>
              ))}
            </div>
            {user.plan_id > 2 && (
              <div className="w-full mt-4">
                <button
                  type="button"
                  onClick={() => setShowMap((prev) => !prev)}
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 hover:border-blue-500 rounded-lg px-4 py-2 transition-colors w-full justify-center"
                >
                  <span>{showMap ? "🗺️ Ocultar Mapa" : "📍 Mostrar Mapa"}</span>
                  <span className="text-xs text-gray-500">
                    {showMap ? "▲" : "▼"}
                  </span>
                </button>
                {showMap && (
                  <div className="mt-2 overflow-auto">
                    <MapLeaflet
                      onPosition={handlePosition}
                      client={selectedClient}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <Button type="submit" disabled={!!loading}>
                {selectedClient ? "Actualizar" : "Aceptar"}
              </Button>

              <Button
                variant="secondary"
                type="button"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
        <ClientsTable
          clients={clients}
          meta={meta}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </RegisterTableLayout>
    </>
  );
};
