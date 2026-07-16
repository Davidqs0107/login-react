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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LabeledInput
                    label="Nombre"
                    type="text"
                    require
                    error={errors.nombre}
                    {...register("nombre", { required: 'El nombre es requerido' })}
                />
                <LabeledInput
                    label="Apellido"
                    type="text"
                    require
                    error={errors.apellido}
                    {...register("apellido", { required: 'El apellido es requerido' })}
                />
                <LabeledInput
                    label="CI"
                    type="text"
                    error={errors.ci}
                    {...register("ci")}
                />
                <LabeledInput
                    label="Direccion"
                    type="text"
                    error={errors.direccion}
                    {...register("direccion")}
                />
                <div className="md:col-span-2">
                    <LabeledInput
                        label="Email"
                        type="email"
                        require
                        error={errors.email}
                        {...register("email", {
                            required: 'El email es requerido',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'El email no es válido',
                            },
                        })}
                    />
                </div>
            </div>
            <div className="flex gap-4">
                <Button type="submit">
                    Guardar
                </Button>
                <Button variant="secondary" type="button" onClick={() => reset()}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};