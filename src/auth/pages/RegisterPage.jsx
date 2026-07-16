import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../layout/AuthLayout';
import { Button } from '../../components/Button';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContex';
import { LabeledInput } from '../../components/LabeledInput';

export const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signup, isAuthenticated, errors: RegisterError } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);
    const onSubmit = handleSubmit(async (values) => {
        const data = {
            empresa: {
                nombre: values.nombreEmpresa,
            },
            nombre: values.nombre,
            email: values.email,
            password: values.password
        }
        signup(data);
    });
    return (
        <AuthLayout title='Registrarse'>
            {
                RegisterError.map((error, index) => (
                    <div key={index} className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>
                ))
            }
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
                <Button type='submit' clase='w-full'
                >
                    Registrarse
                </Button>
                <div className="text-sm mt-3">
                    <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        ¿Ya tienes una cuenta? Ingresa
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
