import React from 'react'
import { AuthLayout } from '../layout/AuthLayout'
import { Button } from '../../components/Button'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContex'
import { LabeledInputAuth } from '../components/LabeledInputAuth'

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
