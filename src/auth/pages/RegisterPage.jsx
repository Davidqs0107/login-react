import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { AuthLayout } from '../layout/AuthLayout';
import { Button } from '../../components/Button';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContex';
import { LabeledInputAuth } from '../components/LabeledInputAuth';

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
