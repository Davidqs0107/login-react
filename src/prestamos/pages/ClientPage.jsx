import React, { useEffect, useState } from 'react'
import { LabeledInput } from '../../components/LabeledInput'
import { Button } from '../../components/Button'
import { useForm } from 'react-hook-form';
import { formFields } from '../forms/clienteForm';
import { useClient } from '../hooks/useClient';
import Swal from 'sweetalert2';
import { ClientsTable } from '../components/ClientTable';
import { RegisterTableLayout } from '../../layout/RegisterTableLayout';

export const ClientPage = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, clearErrors } = useForm();
    // aca se usa el useCliente para comunicarse con la API
    const { createClient, updateClient, deleteClient, getClients, error, loading } = useClient();
    const [clients, setClients] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);
    const onSubmit = handleSubmit(async (data) => {
        if (selectedClient) {
            const payload = {
                ...data,
                id: selectedClient.id
            };
            const client = await updateClient(payload);
            if (client) {
                setClients((prev) => prev.map((c) => (c.id === selectedClient.id ? { ...c, ...payload } : c)));
                Swal.fire({
                    title: "Cliente actualizado",
                    text: "El cliente ha sido actualizado exitosamente",
                    icon: "success"
                });
                reset();
            }
        } else {
            const client = await createClient(data);
            if (client) {
                Swal.fire({
                    title: "Cliente registrado",
                    text: "El cliente ha sido registrado exitosamente",
                    icon: "success"
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
            return setValue(field.name, client[field.name])
        });
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
            confirmButtonText: "Si, eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const client = await deleteClient({ id: clientId, estado: false });
                if (client) {
                    setClients((prev) => prev.filter((client) => client.id !== clientId));
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El cliente fue eliminado",
                        icon: "success"
                    });
                } else {
                    Swal.fire({
                        title: "Ocurrio un error!",
                        text: "El usuario no fue eliminado",
                        icon: "error"
                    });
                }

            }
        });

    };
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getClients();
            if (data) setClients(data.clientes);
        };
        fetchUsers();
    }, []);
    const titleClient = selectedClient ? "Editar Cliente" : "Registro de Cliente";
    return (
        <>
            <RegisterTableLayout title={titleClient}>
                {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
                {loading && <p>Cargando...</p>}
                <form className='mt-8 space-y-6  md:w-2/4 sm:w-full' onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 gap-4'>
                        {formFields.map((field, i) => (
                            <div key={i}>
                                <LabeledInput
                                    type={field.type}
                                    label={field.label}
                                    name={field.name}
                                    register={register}
                                    require={field.required}
                                    error={errors[field.name]}
                                    {...register(field.name, field.validation)}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <Button clase='!w-auto' type='submit'>
                            {selectedClient ? "Actualizar" : "Aceptar"}
                        </Button>

                        <Button
                            clase='!w-auto !bg-gray-500 hover:!bg-gray-600'
                            type='button'
                            onClick={handleCancel}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
                <ClientsTable clients={clients} onEdit={handleEdit} onDelete={handleDelete} />
            </RegisterTableLayout>
        </>
    )
}
