import React, { useEffect, useState } from 'react'
import { RegisterTableLayout } from '../../layout/RegisterTableLayout'
import { Button } from '../../components/Button'
import { LabeledInput } from '../../components/LabeledInput'
import { formFields } from '../forms/usuarioForm'
import { useForm } from 'react-hook-form'
import { useUsers } from '../hooks/useUsers'
import Swal from 'sweetalert2'
import { useAuth } from '../../context/AuthContex'

export const PerfilPage = () => {
    const { user } = useAuth();
    const { register, handleSubmit, formState: { errors }, reset, setValue, clearErrors } = useForm();
    const { updateUserCobrador, getUser, loading, error } = useUsers();
    const onSubmit = handleSubmit(async (data) => {
        const payload = {
            ...data,

        };
        if (payload.password === '') delete payload.password;

        const user = await updateUserCobrador(payload);
        if (user) {
            Swal.fire({
                title: "Usuario actualizado",
                text: "El usuario ha sido actualizado exitosamente",
                icon: "success"
            });
        }

    });
    const getDynamicFormFields = () => {
        return formFields.map((field) => {
            if (field.name === 'email') {
                return { ...field, disabled: true, required: false, validation: {} };
            }
            if (field.name === 'password') {
                return { ...field, label: "Cambiar Password", required: false, validation: {} };
            }
            return { ...field, required: false, validation: {} };
        });
    }


    useEffect(() => {
        const fetchUser = async () => {
            const { id } = user;
            const { usuario } = await getUser(id);
            Object.keys(usuario).forEach((key) => {
                if (key === 'password') return;
                setValue(key, usuario[key]);
            });
        }
        fetchUser();
    }, [])

    const handleCancel = (e) => {
        e.preventDefault();
        clearErrors();
    }
    return (
        <RegisterTableLayout title="Perfil">
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
                                disabled={field.disabled || false}
                                error={errors[field.name]}
                                {...register(field.name, field.validation)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex gap-4">
                    <Button clase='!w-auto' type='submit'>
                        Actualizar
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
        </RegisterTableLayout>
    )
}
