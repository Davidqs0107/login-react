---
name: react-feature-module
description: "Use when: creating new feature modules, adding new pages, adding new sections to the application. Creates complete feature modules following the project's established folder structure: pages/, components/, hooks/, forms/, and API integration."
---

# React Feature Module

Este skill guía la creación de nuevos módulos de features completos siguiendo la arquitectura establecida del proyecto.

## Estructura de un Feature Module

Cada feature module debe seguir esta estructura:

```
src/
  {feature-name}/
    pages/
      {FeatureName}Page.jsx
    components/
      {Component}Table.jsx
      Create{Entity}Modal.jsx
      Edit{Entity}Modal.jsx
    hooks/
      use{Entity}.js
    forms/
      {entity}Form.js
    functions/          # Opcional: para lógica compleja
      {utility}.js
```

## Pasos para Crear un Feature Module

### 1. Crear la estructura de carpetas

```bash
mkdir -p src/{feature-name}/{pages,components,hooks,forms}
```

### 2. Crear el API Service

En `src/api/{feature-name}.js`:

```javascript
import { LoginApi } from "./settings";

export const get{Entity}Request = (page = 1, pageSize = 10) =>
  LoginApi.get(`/{feature-name}?page=${page}&pageSize=${pageSize}`);

export const get{Entity}ByIdRequest = (id) =>
  LoginApi.get(`/{feature-name}/${id}`);

export const create{Entity}Request = (data) =>
  LoginApi.post(`/{feature-name}`, data);

export const update{Entity}Request = (data) =>
  LoginApi.put(`/{feature-name}/${data.id}`, data);

export const delete{Entity}Request = (id, estado = true) =>
  LoginApi.delete(`/{feature-name}/${id}`, { data: { estado } });
```

### 3. Crear el Custom Hook

En `src/{feature-name}/hooks/use{Entity}.js`:

```javascript
import { useState } from 'react';
import {
  get{Entity}Request,
  create{Entity}Request,
  update{Entity}Request,
  delete{Entity}Request
} from '../../api/{feature-name}';

export const use{Entity} = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create{Entity} = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await create{Entity}Request(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.msg || "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const update{Entity} = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await update{Entity}Request(data);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const delete{Entity} = async ({ id, estado = true }) => {
    setLoading(true);
    setError(null);
    try {
      await delete{Entity}Request(id, estado);
      return true;
    } catch (err) {
      setError(err.response?.data?.msg || "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const get{Entity}s = async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await get{Entity}Request(page, pageSize);
      return data;
    } catch (err) {
      setError(err.response?.data?.msg || "Error desconocido");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    create{Entity},
    update{Entity},
    delete{Entity},
    get{Entity}s,
    loading,
    error
  };
};
```

### 4. Crear Form Configuration

En `src/{feature-name}/forms/{entity}Form.js`:

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
  // ... más campos
];
```

### 5. Crear el Page Component

En `src/{feature-name}/pages/{FeatureName}Page.jsx`:

```javascript
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router';
import { use{Entity} } from '../hooks/use{Entity}';
import { {Entity}Table } from '../components/{Entity}Table';
import { Create{Entity}Modal } from '../components/Create{Entity}Modal';
import { Button } from '../../components/Button';
import Swal from 'sweetalert2';

export const {FeatureName}Page = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { get{Entity}s, delete{Entity}, loading } = use{Entity}();

  const loadData = async () => {
    const result = await get{Entity}s();
    if (result) {
      setData(result.data || result);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = () => {
    setIsModalOpen(true);
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
      const success = await delete{Entity}({ id });
      if (success) {
        Swal.fire('Eliminado', 'El registro ha sido eliminado', 'success');
        loadData();
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de {Feature}</h1>
        <Button onClick={handleCreate}>Agregar Nuevo</Button>
      </div>

      <{Entity}Table
        data={data}
        onDelete={handleDelete}
        loading={loading}
      />

      {isModalOpen && (
        <Create{Entity}Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};
```

### 6. Crear Table Component

En `src/{feature-name}/components/{Entity}Table.jsx`:

```javascript
export const {Entity}Table = ({ data, onDelete, loading }) => {
  if (loading) return <LoaderLocal />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{item.nombre}</td>
              <td className="px-4 py-2">
                <button onClick={() => onDelete(item.id)}>
                  Eliminar
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

### 7. Agregar la Ruta

En `src/routes/AppRouter.jsx`, agregar dentro del `<Route element={<ProtectedRoute />}>`:

```javascript
<Route path="/{feature-path}" element={<{FeatureName}Page />} />
```

### 8. Agregar al SideBar

En `src/components/SideBar.jsx`, agregar el item de menú correspondiente.

## Consideraciones

- **Nombres en PascalCase**: Para componentes (ej: `ClientPage`)
- **Nombres en camelCase**: Para hooks y funciones (ej: `useClient`)
- **Nombres en kebab-case**: Para rutas (ej: `/clientes`)
- **React Router**:
  - Usar `import { useNavigate, useParams } from "react-router";`
  - Usar `import { Link, NavLink } from "react-router";`
  - NO usar `from "react-router-dom"`
- **Siempre incluir**: loading y error states en hooks
- **Validaciones**: Usar react-hook-form con validaciones detalladas
- **Feedback visual**: Usar SweetAlert2 para confirmaciones y mensajes
- **Protección de rutas**: Todas las rutas del feature deben estar dentro de `<ProtectedRoute />`

## Ejemplo Completo de Referencia

Ver el módulo `prestamos/` como referencia completa de un feature module robusto con todas las mejores prácticas implementadas.
