import React, { useEffect, useState } from 'react'
import { LabeledInput } from '../../components/LabeledInput'
import { Button } from '../../components/Button'
import { set, useForm } from 'react-hook-form';
import { formFields } from '../forms/usuarioForm';
import { useUsers } from '../hooks/useUsers';
import { UsersTable } from '../components/UserTable';
import Swal from 'sweetalert2';
import { RegisterTableLayout } from '../../layout/RegisterTableLayout';

export const UsuariosPage = () => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, clearErrors } = useForm();
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [passCheck, setPassCheck] = useState(false);
    const { createUser, updateUser, deleteUser, getUsers, loading, error } = useUsers();

    const onSubmit = handleSubmit(async (data) => {
        if (selectedUser) {
            const payload = {
                ...data,
                id: selectedUser.id,
                passCheck
            };
            if (!payload.passCheck) {
                delete payload.password;
            }
            delete payload.passCheck;
            const user = await updateUser(payload);
            if (user) {
                setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...payload } : u)));
                Swal.fire({
                    title: "Usuario actualizado",
                    text: "El usuario ha sido actualizado exitosamente",
                    icon: "success"
                });
                reset();
            }
        } else {
            const user = await createUser(data);
            if (user) {
                setUsers((prev) => [...prev, user.usuario]);
                Swal.fire({
                    title: "Usuario registrado",
                    text: "El usuario ha sido registrado exitosamente",
                    icon: "success"
                });
                reset();
            }
        }
        setSelectedUser(null);
    });
    const handleCancel = (e) => {
        e.preventDefault();
        reset();
        setSelectedUser(null);
    };
    const handleEdit = (user) => {
        setSelectedUser(user);
        formFields.forEach((field) => {
            if (field.name === 'password') {
                return setValue(field.name, '123456');
            }
            setValue(field.name, user[field.name])
        });
        clearErrors();
    };
    const getDynamicFormFields = () =>
        formFields.map((field) => {
            if (field.name === 'password' && selectedUser) {
                return { ...field, required: false, validation: {} };
            }
            return field;
        });
    const handleDelete = async (userId) => {
        Swal.fire({
            title: "Esta Seguro de eliminar el usuario?",
            text: "Esta accion no se puede revertir!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const user = await deleteUser({ id: userId, estado: false });
                if (user) {
                    setUsers((prev) => prev.filter((user) => user.id !== userId));
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El usuario fue eliminado",
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
            const data = await getUsers();
            if (data) setUsers(data.usuarios);
        };
        fetchUsers();
    }, []);
    const titleUsuario = selectedUser ? "Editar Usuario" : "Registrar Usuario";
    return (
        <>
            <RegisterTableLayout title={titleUsuario}>
                {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
                {loading && <p>Cargando...</p>}
                <form className='mt-8 space-y-6  md:w-2/4 sm:w-full' onSubmit={onSubmit}>

                    <div className='grid grid-cols-2 gap-4'>
                        {getDynamicFormFields().map((field, i) => (
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
                                {
                                    field.name === 'password' && selectedUser &&
                                    (<>
                                        <div key={`check-${i}`}>
                                            <label>Restablecer contraseña</label>
                                            <input className='!ml-2'
                                                type="checkbox"
                                                name="passCheck"
                                                checked={passCheck}
                                                onChange={(e) => {
                                                    setPassCheck(e.target.checked);
                                                    setValue('passCheck', e.target.checked); // Sincronizar con react-hook-form
                                                }} />
                                        </div>

                                    </>)
                                }

                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <Button clase='!w-auto' type='submit'>
                            {selectedUser ? "Actualizar" : "Aceptar"}
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
                <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
            </RegisterTableLayout>
        </>
    )
}
