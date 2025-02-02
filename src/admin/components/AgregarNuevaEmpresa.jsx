import React from 'react'
import { Button } from '../../components/Button'
import { LabeledInputAuth } from '../../auth/components/LabeledInputAuth'
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
                <LabeledInputAuth type="text"
                    label="Nombre Empresa" name="nombreEmpresa" register={register} require={true}
                />
                {
                    errors.nombreEmpresa && <div className="text-red-500 text-sm !mt-0">Nombre de empresa es requerido</div>
                }
                <LabeledInputAuth type="text"
                    label="Nombre" name="nombre" register={register} require={true}
                />
                {
                    errors.nombre && <div className="text-red-500 text-sm !mt-0">Nombre es requerido</div>
                }
                <LabeledInputAuth type="email"
                    label="Email" name="email" register={register} require={true}
                />
                {
                    errors.email && <div className="text-red-500 text-sm !mt-0">Email es requerido</div>
                }
                <LabeledInputAuth type="password"
                    label="Password" name="password" register={register} require={true}
                />
                {
                    errors.password && <div className="text-red-500 text-sm !mt-0">Password es requerido</div>
                }
                <Button type='submit'

                >
                    Crear
                </Button>

            </form>
        </>
    )
}
