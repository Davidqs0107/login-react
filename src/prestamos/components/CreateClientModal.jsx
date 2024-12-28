import { useForm } from "react-hook-form";
import { LabeledInput } from "../../components/LabeledInput";
import { Button } from "../../components/Button";

export const CrearClienteForm = ({ onCreate }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = handleSubmit((data) => {
        onCreate(data);
        reset();
    });

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <LabeledInput
                label="Nombre"
                type="text"
                name="nombre"
                register={register}
                require={true}
                error={errors.nombre}
                {...register("nombre", { required: 'El nombre es requerido' })}
            />
            <LabeledInput
                label="Apellido"
                type="text"
                name="apellido"
                register={register}
                require={true}
                error={errors.apellido}
                {...register("apellido", { required: 'El apellido es requerido' })}
            />
            <LabeledInput
                label="CI"
                type="text"
                name="ci"
                register={register}
                error={errors.ci}
                {...register("ci")}
            />
            <LabeledInput
                label="Direccion"
                type="text"
                name="direccion"
                register={register}
                error={errors.direccion}
                {...register("direccion")}

            />
            <LabeledInput
                label="Email"
                type="email"
                name="email"
                register={register}
                require={true}
                error={errors.email}
                {...register("email", {
                    required: 'El email es requerido',
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'El email no es válido',
                    },
                })}
            />
            <div className="flex gap-4">
                <Button clase="!w-auto" type="submit">
                    Guardar
                </Button>
                <Button clase="!w-auto bg-gray-500 hover:bg-gray-600" type="button" onClick={() => reset()}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};