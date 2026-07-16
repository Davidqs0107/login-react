import React from 'react'
import { Button } from '../../components/Button'
import { LabeledInput } from '../../components/LabeledInput'
import { useForm } from 'react-hook-form';
import { useAdmin } from '../hooks/useAdmin';
import { LoaderLocal } from '../../components/LoaderLocal';

export const AgregarNuevaEmpresa = ({ closeModal }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createEmpresa, loading, error } = useAdmin();
    const onSubmit = handleSubmit(async (values) => {
        const data = {
            empresa: {
                nombre: values.nombreEmpresa,
            },
            nombre: values.nombre,
            email: values.email,
            password: values.password
        }
        const empresa = await createEmpresa(data);
        if (empresa) {
            console.log(empresa)
            closeModal(false);
        }
    });

    return (
        <>
            {error && <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
            {loading && <LoaderLocal />}
            <form className='mt-8 space-y-6' onSubmit={onSubmit}>
                <LabeledInput type="text"
                    label="Nombre Empresa" require error={errors.nombreEmpresa}
                    {...register('nombreEmpresa', { required: 'El nombre de empresa es requerido' })}
                />
                <LabeledInput type="text"
                    label="Nombre" require error={errors.nombre}
                    {...register('nombre', { required: 'El nombre es requerido' })}
                />
                <LabeledInput type="email"
                    label="Email" require error={errors.email}
                    {...register('email', { required: 'El email es requerido' })}
                />
                <LabeledInput type="password"
                    label="Password" require error={errors.password}
                    {...register('password', { required: 'El password es requerido' })}
                />
                <Button type='submit'

                >
                    Crear
                </Button>

            </form>
        </>
    )
}
