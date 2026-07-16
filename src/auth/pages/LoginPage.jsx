import React from 'react'
import { AuthLayout } from '../layout/AuthLayout'
import { Button } from '../../components/Button'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContex'
import { LabeledInput } from '../../components/LabeledInput'

export const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { singIn, errors: LoginErrors } = useAuth();

    const onSubmit = handleSubmit((data) => {
        singIn(data);
    });
    return (
        <AuthLayout title='Ingresar'>
            {
                LoginErrors.map((error, index) => (
                    <div key={index} className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>
                ))
            }
            <form className='mt-8 space-y-6' onSubmit={onSubmit}>

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
                    Login
                </Button>
                {/* <div className="text-sm mt-3">
                    <Link to="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        ¿No tienes una cuenta? Regístrate
                    </Link>
                </div> */}
            </form>
        </AuthLayout>
    )
}
