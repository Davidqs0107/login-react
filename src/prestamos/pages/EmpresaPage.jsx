import React, { useEffect, useState } from "react";
import { LabeledInput } from "../../components/LabeledInput";
import { Button } from "../../components/Button";
import { useForm } from "react-hook-form";
import { useEmpresa } from "../hooks/useEmpresa";
import Swal from "sweetalert2";
import { RegisterTableLayout } from "../../layout/RegisterTableLayout";
import { LoaderLocal } from "../../components/LoaderLocal";

export const EmpresaPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { getEmpresa, updateEmpresa, error, loading } = useEmpresa();
  const [empresa, setEmpresa] = useState(null);

  const formFields = [
    {
      name: "nombre",
      label: "Nombre de la Empresa",
      type: "text",
      required: true,
      validation: {
        required: "El nombre es requerido",
        minLength: {
          value: 3,
          message: "El nombre debe tener al menos 3 caracteres",
        },
      },
    },
    {
      name: "direccion",
      label: "Dirección",
      type: "text",
      required: true,
      validation: {
        required: "La dirección es requerida",
        minLength: {
          value: 5,
          message: "La dirección debe tener al menos 5 caracteres",
        },
      },
    },
    {
      name: "telefono",
      label: "Teléfono",
      type: "text",
      required: true,
      validation: {
        required: "El teléfono es requerido",
        pattern: {
          value: /^[0-9]{7,10}$/,
          message: "El teléfono debe tener entre 7 y 10 dígitos",
        },
      },
    },
  ];

  useEffect(() => {
    fetchEmpresa();
  }, []);

  const fetchEmpresa = async () => {
    const data = await getEmpresa();
    if (data && data.empresa && data.empresa.length > 0) {
      const empresaData = data.empresa[0];
      setEmpresa(empresaData);
      setValue("nombre", empresaData.nombre);
      setValue("direccion", empresaData.direccion);
      setValue("telefono", empresaData.telefono);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
    };

    const result = await updateEmpresa(payload);
    if (result) {
      setEmpresa({ ...empresa, ...payload });
      Swal.fire({
        title: "Empresa actualizada",
        text: "Los datos de la empresa han sido actualizados exitosamente",
        icon: "success",
      });
    }
  });

  const handleCancel = (e) => {
    e.preventDefault();
    if (empresa) {
      setValue("nombre", empresa.nombre);
      setValue("direccion", empresa.direccion);
      setValue("telefono", empresa.telefono);
    } else {
      reset();
    }
  };

  return (
    <RegisterTableLayout title="Configuración de Empresa">
      {error && (
        <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {loading && <LoaderLocal />}

      <form className="mt-8 space-y-6 md:w-2/4 sm:w-full" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-4">
          {formFields.map((field, i) => (
            <div key={i}>
              <LabeledInput
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
        </div>

        <div className="flex gap-4">
          <Button clase="!w-auto" type="submit" disabled={!!loading}>
            Actualizar
          </Button>

          <Button
            clase="!w-auto !bg-gray-500 hover:!bg-gray-600"
            type="button"
            onClick={handleCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </RegisterTableLayout>
  );
};
