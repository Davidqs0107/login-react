import React from 'react'
import { formFields } from '../forms/descargosForm';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/Button';
import { LabeledInput } from '../../components/LabeledInput';
import { useDescargos } from '../hooks/useDescargos';
import Swal from 'sweetalert2';

export const DescargosRegistroCobrador = ({ setDescargos }) => {
    const { createDescargo, error, loading } = useDescargos();

    const { register, handleSubmit, formState: { errors }, reset, setValue, clearErrors } = useForm();
    const onSubmit = handleSubmit(async (data) => {
        console.log(data)
        const payload = {
            ...data,
        };
        const result = await createDescargo(payload);
        console.log(result)
        if (result) {
            setDescargos((prev) => [result.descargo, ...prev]);
            Swal.fire({
                title: "Descargo registrado",
                text: "El descargo ha sido registrado exitosamente",
                icon: "success"
            });
            reset();
        }
    });
    return (
        <form className='mt-8 space-y-6  md:w-2/4 sm:w-full mb-3' onSubmit={onSubmit}>
            <div className='grid grid-cols-2 gap-4'>
                {formFields.map((field, i) => (
                    <div key={i}>
                        <LabeledInput
                            step={field.step}
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
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de pago</label>
                    <select
                        {...register('tipo_pago', { required: 'Seleccione un tipo de pago' })}
                        className="w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="efectivo">Efectivo</option>
                        <option value="qr">QR</option>
                    </select>
                    {errors.tipo_pago && <p className="text-red-500 text-sm">{errors.tipo_pago.message}</p>}
                </div>
            </div>

            <div className="flex gap-4">
                <Button clase='!w-auto' type='submit'
                    disabled={!!loading}
                >
                    Aceptar
                </Button>

                <Button
                    clase='!w-auto !bg-gray-500 hover:!bg-gray-600'
                    type='button'
                    onClick={() => reset()}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    )
}
