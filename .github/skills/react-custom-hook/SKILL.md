---
name: react-custom-hook
description: "Use when: creating custom hooks, business logic hooks, data fetching hooks. Creates custom React hooks following project patterns with loading/error states, async operations, and proper state management."
---

# React Custom Hook

Este skill guía la creación de custom hooks siguiendo los patrones establecidos en el proyecto.

## Patrón Estándar de Custom Hook

Todos los custom hooks en el proyecto siguen este patrón:

```javascript
import { useState } from 'react';
import {
  get{Entity}Request,
  create{Entity}Request,
  update{Entity}Request,
  delete{Entity}Request
} from '../../api/{module}';

export const use{Entity} = () => {
  // Estados locales para loading y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Métodos CRUD
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
    } catch (err) {
      setError(err.response?.data?.msg || "Error desconocido");
      return null;
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

  // Retornar métodos y estados
  return {
    // Métodos
    create{Entity},
    update{Entity},
    delete{Entity},
    get{Entity}s,
    // Estados
    loading,
    error
  };
};
```

## Ubicación

Los custom hooks se colocan en:

```
src/{feature}/hooks/use{Entity}.js
```

Ejemplos:

- `src/prestamos/hooks/useClient.js`
- `src/usuarios/hooks/useUsers.js`
- `src/prestamos/hooks/useLoan.js`

## Nombres de Archivos y Exports

- **Archivo**: `use{Entity}.js` (camelCase)
- **Export**: `export const use{Entity} = () => {}`
- **Uso**: `const { createClient, loading } = useClient();`

## Características Obligatorias

### 1. Estados de Loading y Error

**Siempre** incluir:

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### 2. Try-Catch-Finally en Operaciones Asíncronas

```javascript
const someOperation = async (data) => {
  setLoading(true);
  setError(null);
  try {
    // Operación
  } catch (err) {
    setError(err.response?.data?.msg || "Error desconocido");
  } finally {
    setLoading(false);
  }
};
```

### 3. Manejo de Errores Consistente

```javascript
// Para operaciones que retornan datos
catch (err) {
  setError(err.response?.data?.msg || "Error desconocido");
  return null;
}

// Para operaciones booleanas (delete, update)
catch (err) {
  setError(err.response?.data?.msg || "Error desconocido");
  return false;
}
```

### 4. Retorno Organizado

Agrupar por categorías:

```javascript
return {
  // Métodos
  createEntity,
  updateEntity,
  deleteEntity,
  getEntities,
  // Estados
  loading,
  error,
};
```

## Patrones Especiales

### Hook con Contexto

Cuando se necesita acceder al contexto:

```javascript
import { useAuth } from "../../context/AuthContex";

export const useClient = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Usar user.empresa_id en las operaciones
  const getClients = async () => {
    // ... usar empresa_id del contexto
  };

  return { getClients, loading, error };
};
```

### Hook con Estado Local

Para hooks que gestionan estado además de operaciones:

```javascript
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);

  const open = (initialData = null) => {
    setData(initialData);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setData(null);
  };

  return {
    isOpen,
    data,
    open,
    close,
  };
};
```

### Hook de Operación Única

Para hooks que exponen una sola operación:

```javascript
export const usePdfGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePDF = async (prestamo, cuotas) => {
    setLoading(true);
    setError(null);
    try {
      const doc = await generatePDF(prestamo, cuotas);
      doc.save(`prestamo-${prestamo.id}.pdf`);
      return true;
    } catch (err) {
      setError("Error al generar PDF");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { generatePDF, loading, error };
};
```

## Uso en Componentes

```javascript
import { useClient } from "../hooks/useClient";

export const ClientPage = () => {
  const {
    createClient,
    updateClient,
    deleteClient,
    getClients,
    loading,
    error,
  } = useClient();

  const handleCreate = async (data) => {
    const result = await createClient(data);
    if (result) {
      // Éxito
    } else {
      // Error - mostrar error desde hook.error
    }
  };

  return (
    <div>
      {loading && <LoaderLocal />}
      {error && <div className="text-red-500">{error}</div>}
      {/* ... */}
    </div>
  );
};
```

## Anti-Patrones (❌ Evitar)

### ❌ No manejar errores

```javascript
// MAL
const createClient = async (data) => {
  const result = await createClientRequest(data);
  return result;
};
```

### ❌ No usar loading state

```javascript
// MAL
const getClients = async () => {
  const { data } = await getClientRequest();
  return data;
};
```

### ❌ Resetear error en el componente

```javascript
// MAL - El error debe controlarse en el hook
useEffect(() => {
  setError(null);
}, []);
```

### ❌ Lógica de negocio en el componente

```javascript
// MAL - Esta lógica debe estar en el hook
const handleDelete = async (id) => {
  try {
    await deleteClientRequest(id);
  } catch (error) {
    // ...
  }
};
```

## Buenas Prácticas

✅ **Resetear error** antes de cada operación nueva
✅ **Siempre usar** finally para setLoading(false)
✅ **Retornar valores** que indiquen éxito/fallo (data, true/false, null)
✅ **Nombres descriptivos** para los métodos (create, update, delete, get)
✅ **Exportar estados** (loading, error) para que el componente los use

## Referencias del Proyecto

Ver implementaciones reales en:

- `src/prestamos/hooks/useClient.js`
- `src/usuarios/hooks/useUsers.js`
- `src/prestamos/hooks/useLoan.js`
- `src/prestamos/hooks/useCuota.js`
