---
name: modal-crud-workflow
description: "Use when: implementing CRUD operations, creating modals for create/edit/delete, managing modal states. Implements complete modal-based CRUD workflows with SweetAlert confirmations and proper state management."
---

# Modal CRUD Workflow

Este skill guía la implementación de operaciones CRUD completas usando modales, siguiendo los patrones del proyecto.

## Arquitectura General

El proyecto usa un patrón basado en:

1. **Page Component** - Contiene la tabla y gestiona los modales
2. **Table Component** - Muestra los datos y botones de acción
3. **Create Modal** - Modal para crear nuevos registros
4. **Edit Modal** - Modal para editar registros existentes
5. **Delete** - Confirmación con SweetAlert2

## 1. Page Component (Container)

```javascript
import { useEffect, useState } from 'react';
import { use{Entity} } from '../hooks/use{Entity}';
import { {Entity}Table } from '../components/{Entity}Table';
import { Create{Entity}Modal } from '../components/Create{Entity}Modal';
import { Edit{Entity}Modal } from '../components/Edit{Entity}Modal';
import { Button } from '../../components/Button';
import { LoaderLocal } from '../../components/LoaderLocal';
import Swal from 'sweetalert2';

export const {Entity}Page = () => {
  // Estados para los datos y modales
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Hook para operaciones CRUD
  const {
    get{Entity}s,
    delete{Entity},
    loading,
    error
  } = use{Entity}();

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // Función para recargar datos
  const loadData = async () => {
    const result = await get{Entity}s();
    if (result) {
      setData(result.data || result);
    }
  };

  // Handlers para modales
  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const success = await delete{Entity}({ id, estado: false });
      if (success) {
        Swal.fire({
          title: 'Eliminado',
          text: 'El registro ha sido eliminado',
          icon: 'success',
          timer: 2000
        });
        loadData();
      } else {
        Swal.fire({
          title: 'Error',
          text: error || 'No se pudo eliminar el registro',
          icon: 'error'
        });
      }
    }
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleSuccess = () => {
    loadData();
  };

  if (loading && data.length === 0) {
    return <LoaderLocal />;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de {Entity}</h1>
        <Button onClick={handleCreate}>
          Agregar Nuevo
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabla */}
      <{Entity}Table
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modales */}
      {isCreateModalOpen && (
        <Create{Entity}Modal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSuccess={handleSuccess}
        />
      )}

      {isEditModalOpen && selectedItem && (
        <Edit{Entity}Modal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleSuccess}
          item={selectedItem}
        />
      )}
    </div>
  );
};
```

## 2. Table Component

```javascript
import { Pencil, Trash2 } from 'lucide-react';
import { LoaderLocal } from '../../components/LoaderLocal';

export const {Entity}Table = ({ data, onEdit, onDelete, loading }) => {
  if (loading) {
    return <LoaderLocal />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay registros disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.nombre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  title="Editar"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## 3. Create Modal Component

```javascript
import { useForm } from "react-hook-form";
import { use{Entity} } from '../hooks/use{Entity}';
import { Modal } from "../../components/Modal";
import { LabeledInput } from "../../components/LabeledInput";
import { Button } from "../../components/Button";
import Swal from 'sweetalert2';

export const Create{Entity}Modal = ({ isOpen, onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { create{Entity}, loading, error } = use{Entity}();

  const onSubmit = handleSubmit(async (data) => {
    const result = await create{Entity}(data);

    if (result) {
      await Swal.fire({
        title: 'Éxito',
        text: 'Registro creado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      reset();
      onSuccess();
      onClose();
    } else {
      Swal.fire({
        title: 'Error',
        text: error || 'Ocurrió un error al crear el registro',
        icon: 'error'
      });
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear {Entity}">
      <form onSubmit={onSubmit} className="space-y-4">
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

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            clase="!w-auto bg-gray-500 hover:bg-gray-600"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            clase="!w-auto"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
```

## 4. Edit Modal Component

```javascript
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { use{Entity} } from '../hooks/use{Entity}';
import { Modal } from "../../components/Modal";
import { LabeledInput } from "../../components/LabeledInput";
import { Button } from "../../components/Button";
import Swal from 'sweetalert2';

export const Edit{Entity}Modal = ({ isOpen, onClose, onSuccess, item }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { update{Entity}, loading, error } = use{Entity}();

  // Cargar datos al abrir el modal
  useEffect(() => {
    if (isOpen && item) {
      reset({
        nombre: item.nombre,
        email: item.email,
        // ... otros campos
      });
    }
  }, [isOpen, item, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const result = await update{Entity}({
      ...data,
      id: item.id
    });

    if (result) {
      await Swal.fire({
        title: 'Éxito',
        text: 'Registro actualizado correctamente',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      reset();
      onSuccess();
      onClose();
    } else {
      Swal.fire({
        title: 'Error',
        text: error || 'Ocurrió un error al actualizar el registro',
        icon: 'error'
      });
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar {Entity}">
      <form onSubmit={onSubmit} className="space-y-4">
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

        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4 justify-end pt-4">
          <Button
            type="button"
            clase="!w-auto bg-gray-500 hover:bg-gray-600"
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            clase="!w-auto"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
```

## 5. Modal Component (Base)

El proyecto usa un componente Modal base en `src/components/Modal.jsx`:

```javascript
export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};
```

## Patrón de SweetAlert2

### Confirmación de Eliminación

```javascript
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    const success = await deleteEntity({ id });
    if (success) {
      Swal.fire({
        title: "Eliminado",
        text: "El registro ha sido eliminado",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      loadData();
    }
  }
};
```

### Notificación de Éxito

```javascript
await Swal.fire({
  title: "Éxito",
  text: "Operación realizada correctamente",
  icon: "success",
  timer: 2000,
  showConfirmButton: false,
});
```

### Notificación de Error

```javascript
Swal.fire({
  title: "Error",
  text: error || "Ocurrió un error",
  icon: "error",
});
```

## Gestión de Estados

### Estados Necesarios en Page

```javascript
const [data, setData] = useState([]); // Datos de la tabla
const [selectedItem, setSelectedItem] = useState(null); // Item seleccionado para editar
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
```

### Pattern de Flujo

```
1. Usuario click "Agregar" → setIsCreateModalOpen(true)
2. Usuario llena form y submit → createEntity()
3. Si éxito → onSuccess() → loadData() → setIsCreateModalOpen(false)
4. Si error → Mostrar mensaje de error

Para Edit:
1. Usuario click "Editar" en tabla → setSelectedItem(item) → setIsEditModalOpen(true)
2. Modal carga datos con useEffect → reset(item)
3. Usuario edita y submit → updateEntity()
4. Si éxito → onSuccess() → loadData() → setIsEditModalOpen(false)
```

## Modal Combinado (Create + Edit)

Alternativa: Un solo modal para crear y editar:

```javascript
export const {Entity}Modal = ({ isOpen, onClose, onSuccess, item = null }) => {
  const isEditing = !!item;
  const { create{Entity}, update{Entity}, loading, error } = use{Entity}();

  useEffect(() => {
    if (isOpen && item) {
      reset(item);
    } else if (isOpen) {
      reset({});
    }
  }, [isOpen, item, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const result = isEditing
      ? await update{Entity}({ ...data, id: item.id })
      : await create{Entity}(data);

    if (result) {
      Swal.fire({
        title: 'Éxito',
        text: `Registro ${isEditing ? 'actualizado' : 'creado'} correctamente`,
        icon: 'success',
        timer: 2000
      });
      reset();
      onSuccess();
      onClose();
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar' : 'Crear'}
    >
      {/* Form único */}
    </Modal>
  );
};
```

## Iconos (lucide-react)

El proyecto usa lucide-react para iconos:

```javascript
import { Pencil, Trash2, Plus, X, Search } from 'lucide-react';

// Uso:
<Pencil size={18} />
<Trash2 size={18} />
<Plus size={20} />
```

## Buenas Prácticas

✅ **Separar** componentes: Page, Table, Modal (Create/Edit)
✅ **Reset** del form al cerrar/abrir modal
✅ **Recargar** datos después de crear/editar/eliminar
✅ **Confirmación** con SweetAlert antes de eliminar
✅ **Feedback visual** con loading states y mensajes
✅ **Limpiar** selectedItem al cerrar modal de edición
✅ **Deshabilitar** botón submit durante loading

## Referencias del Proyecto

Ver implementaciones reales en:

- `src/prestamos/pages/ClientPage.jsx`
- `src/usuarios/pages/UsuariosPage.jsx`
- `src/prestamos/components/ClientTable.jsx`
- `src/prestamos/components/CreateClientModal.jsx`
