---
name: react-form-handling
description: "Use when: creating forms, form validation, handling user input. Implements forms using react-hook-form with validation, error handling, and integration with the project's LabeledInput components."
---

# React Form Handling

Este skill guía la creación de formularios usando `react-hook-form` siguiendo los patrones del proyecto.

## Configuración de Formulario

### 1. Definir Form Fields Configuration

Crear archivo en `src/{feature}/forms/{entity}Form.js`:

```javascript
export const formFields = [
  {
    name: "nombre",
    label: "Nombre",
    type: "text",
    required: true,
    validation: {
      required: "El nombre es requerido",
    },
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    validation: {
      required: "El email es requerido",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "El email no es válido",
      },
    },
  },
  {
    name: "telefono",
    label: "Teléfono",
    type: "text",
    required: false,
    validation: {},
  },
  {
    name: "ci",
    label: "CI",
    type: "text",
    required: false,
    validation: {},
  },
];
```

## Patrón de Componente Form

### Forma 1: Inline en Modal/Page

```javascript
import { useForm } from "react-hook-form";
import { LabeledInput } from "../../components/LabeledInput";
import { Button } from "../../components/Button";

export const CreateClientModal = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { createClient, loading, error } = useClient();

  const onSubmit = handleSubmit(async (data) => {
    const result = await createClient(data);
    if (result) {
      reset();
      onSuccess();
      onClose();
    }
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Cliente">
      <form className="space-y-4" onSubmit={onSubmit}>
        <LabeledInput
          label="Nombre"
          type="text"
          name="nombre"
          register={register}
          require={true}
          error={errors.nombre}
          {...register("nombre", { required: "El nombre es requerido" })}
        />

        <LabeledInput
          label="Email"
          type="email"
          name="email"
          register={register}
          require={true}
          error={errors.email}
          {...register("email", {
            required: "El email es requerido",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "El email no es válido",
            },
          })}
        />

        <LabeledInput
          label="CI"
          type="text"
          name="ci"
          register={register}
          error={errors.ci}
          {...register("ci")}
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            clase="!w-auto bg-gray-500 hover:bg-gray-600"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" clase="!w-auto" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
```

### Forma 2: Form Component Separado

```javascript
// src/{feature}/components/Create{Entity}Form.jsx
import { useForm } from "react-hook-form";
import { LabeledInput } from "../../components/LabeledInput";
import { Button } from "../../components/Button";

export const CreateClientForm = ({ onCreate, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

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
        {...register("nombre", { required: "El nombre es requerido" })}
      />

      <div className="flex gap-4">
        <Button clase="!w-auto" type="submit">
          Guardar
        </Button>
        <Button
          clase="!w-auto bg-gray-500 hover:bg-gray-600"
          type="button"
          onClick={() => reset()}
        >
          Limpiar
        </Button>
      </div>
    </form>
  );
};
```

## Componentes de Input del Proyecto

### LabeledInput (Principal)

Usado para la mayoría de inputs:

```javascript
<LabeledInput
  label="Nombre" // Label del campo
  type="text" // text, email, password, number, date, etc.
  name="nombre" // Nombre del campo
  register={register} // register de react-hook-form
  require={true} // Si es requerido (muestra *)
  error={errors.nombre} // Objeto de error
  {...register("nombre", {
    // Validaciones de react-hook-form
    required: "El nombre es requerido",
    minLength: {
      value: 3,
      message: "Mínimo 3 caracteres",
    },
  })}
/>
```

### LabeledInputAuth

Usado solo en páginas de autenticación:

```javascript
<LabeledInputAuth
  type="email"
  label="Email"
  name="email"
  register={register}
  require={true}
/>
```

### Input Básico

Para casos especiales:

```javascript
<Input
  type="text"
  name="search"
  placeholder="Buscar..."
  {...register("search")}
/>
```

## Validaciones Comunes

### Campo Requerido

```javascript
{...register("nombre", {
  required: 'El nombre es requerido'
})}
```

### Email

```javascript
{...register("email", {
  required: 'El email es requerido',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'El email no es válido'
  }
})}
```

### Longitud Mínima/Máxima

```javascript
{...register("password", {
  required: 'La contraseña es requerida',
  minLength: {
    value: 6,
    message: 'Mínimo 6 caracteres'
  },
  maxLength: {
    value: 20,
    message: 'Máximo 20 caracteres'
  }
})}
```

### Números

```javascript
{...register("monto", {
  required: 'El monto es requerido',
  min: {
    value: 0,
    message: 'El monto debe ser mayor a 0'
  },
  valueAsNumber: true  // Convierte a número
})}
```

### Validación Custom

```javascript
{...register("confirmar_password", {
  required: 'Confirma tu contraseña',
  validate: (value) =>
    value === getValues('password') || 'Las contraseñas no coinciden'
})}
```

## Mostrar Errores

### Error Individual

```javascript
{
  errors.nombre && (
    <div className="text-red-500 text-sm !mt-0">{errors.nombre.message}</div>
  );
}
```

### Error del Hook (API)

```javascript
{
  error && (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );
}
```

### Lista de Errores (Auth)

```javascript
{
  LoginErrors.map((error, index) => (
    <div
      key={index}
      className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    >
      {error}
    </div>
  ));
}
```

## React Select (Dropdowns)

Para campos de selección:

```javascript
import Select from "react-select";
import { Controller } from "react-hook-form";

<Controller
  name="tipo_prestamo"
  control={control}
  rules={{ required: "El tipo de préstamo es requerido" }}
  render={({ field }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Tipo de Préstamo</label>
      <Select
        {...field}
        options={[
          { value: "fijo", label: "Fijo" },
          { value: "cuota", label: "Cuota" },
        ]}
        placeholder="Seleccionar tipo"
        className="react-select-container"
        classNamePrefix="react-select"
      />
      {errors.tipo_prestamo && (
        <span className="text-red-500 text-sm">
          {errors.tipo_prestamo.message}
        </span>
      )}
    </div>
  )}
/>;
```

## Manejo del Submit

### Submit Básico

```javascript
const onSubmit = handleSubmit(async (data) => {
  const result = await createEntity(data);
  if (result) {
    reset();
    onSuccess();
  }
});
```

### Submit con SweetAlert

```javascript
const onSubmit = handleSubmit(async (data) => {
  const result = await createEntity(data);
  if (result) {
    await Swal.fire({
      title: "Éxito",
      text: "Cliente creado correctamente",
      icon: "success",
    });
    reset();
    onSuccess();
  } else {
    Swal.fire({
      title: "Error",
      text: error || "Ocurrió un error",
      icon: "error",
    });
  }
});
```

## Reset del Formulario

### Reset Completo

```javascript
reset(); // Limpia todos los campos
```

### Reset con Valores Específicos

```javascript
reset({
  nombre: "",
  email: "",
  telefono: "123456",
});
```

### Reset al Cerrar Modal

```javascript
const handleClose = () => {
  reset();
  onClose();
};
```

## Valores por Defecto (Edit Form)

### Usando defaultValues

```javascript
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm({
  defaultValues: {
    nombre: cliente?.nombre || "",
    email: cliente?.email || "",
    ci: cliente?.ci || "",
  },
});
```

### Usando reset con useEffect

```javascript
useEffect(() => {
  if (isOpen && cliente) {
    reset({
      nombre: cliente.nombre,
      email: cliente.email,
      ci: cliente.ci,
    });
  }
}, [isOpen, cliente, reset]);
```

## Modelo Completo: Create y Edit

```javascript
export const ClientModal = ({ isOpen, onClose, onSuccess, cliente = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { createClient, updateClient, loading, error } = useClient();

  const isEditing = !!cliente;

  useEffect(() => {
    if (isOpen && cliente) {
      reset(cliente);
    } else if (isOpen) {
      reset({});
    }
  }, [isOpen, cliente, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const result = isEditing
      ? await updateClient({ ...data, id: cliente.id })
      : await createClient(data);

    if (result) {
      reset();
      onSuccess();
      onClose();
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Cliente" : "Crear Cliente"}
    >
      <form onSubmit={onSubmit}>
        {/* Campos del formulario */}
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
        </Button>
      </form>
    </Modal>
  );
};
```

## Buenas Prácticas

✅ **Siempre** resetear el form después de submit exitoso
✅ **Deshabilitar** el botón de submit durante loading
✅ **Mostrar** feedback visual (loading, errores)
✅ **Validar** en el frontend antes de enviar al backend
✅ **Usar** LabeledInput para consistencia en la UI
✅ **Implementar** botón Cancelar en modales
✅ **Limpiar** el form al cerrar modales

## Referencias del Proyecto

Ver implementaciones reales en:

- `src/auth/pages/LoginPage.jsx`
- `src/prestamos/components/CreateClientModal.jsx`
- `src/usuarios/forms/usuarioForm.js`
