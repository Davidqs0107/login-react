---
name: api-integration
description: "Use when: integrating APIs, creating API services, making HTTP requests. Implements API services using axios with interceptors, authentication tokens, and consistent error handling."
---

# API Integration

Este skill guía la integración de APIs usando Axios siguiendo los patrones del proyecto.

## Configuración Base de Axios

### settings.js

El proyecto usa una instancia centralizada de Axios en `src/api/settings.js`:

```javascript
import axios from "axios";
import { getEnvVariables } from "../helpers/getEnvVariables";

const { VITE_API_URL } = getEnvVariables();

export const LoginApi = axios.create({
  baseURL: `${VITE_API_URL}`,
});

// Interceptor para agregar token automáticamente
LoginApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };
  return config;
});
```

**Características clave**:

- ✅ BaseURL desde variables de entorno
- ✅ Interceptor que agrega token automáticamente a todas las requests
- ✅ Token guardado en localStorage
- ✅ Una sola instancia para toda la app

## Estructura de API Services

Cada módulo tiene su propio archivo de API:

```
src/api/
  settings.js          # Configuración de axios
  auth.js              # Servicios de autenticación
  clientes.js          # Servicios de clientes
  prestamos.js         # Servicios de préstamos
  usuarios.js          # Servicios de usuarios
  cuotas.js            # Servicios de cuotas
  pagos.js             # Servicios de pagos
  empresa.js           # Servicios de empresa
  admin.js             # Servicios de admin
  descargos.js         # Servicios de descargos
```

## Patrón de API Service

### Template Básico

```javascript
import { LoginApi } from "./settings";

// GET - Listar con paginación
export const get{Entity}Request = (page = 1, pageSize = 10) =>
  LoginApi.get(`/{endpoint}?page=${page}&pageSize=${pageSize}`);

// GET - Obtener por ID
export const get{Entity}ByIdRequest = (id) =>
  LoginApi.get(`/{endpoint}/${id}`);

// POST - Crear
export const create{Entity}Request = (data) =>
  LoginApi.post(`/{endpoint}`, data);

// PUT - Actualizar
export const update{Entity}Request = (data) =>
  LoginApi.put(`/{endpoint}/${data.id}`, data);

// DELETE - Eliminar (soft delete con estado)
export const delete{Entity}Request = (id, estado = true) =>
  LoginApi.delete(`/{endpoint}/${id}`, { data: { estado } });
```

### Ejemplo Real: clientes.js

```javascript
import { LoginApi } from "./settings";

export const getClientRequest = (page = 1, pageSize = 10) =>
  LoginApi.get(`/cliente?page=${page}&pageSize=${pageSize}`);

export const getClientByIdRequest = (id) => LoginApi.get(`/cliente/${id}`);

export const registerClientRequest = (client) =>
  LoginApi.post(`/cliente`, client);

export const updateClientRequest = (client) =>
  LoginApi.put(`/cliente/${client.id}`, client);

export const deleteClientRequest = (id, estado = true) =>
  LoginApi.delete(`/cliente/${id}`, { data: { estado } });
```

### Ejemplo Real: auth.js

```javascript
import { LoginApi } from "./settings";

export const registerRequest = (user) => LoginApi.post(`/auth/register`, user);

export const loginRequest = (user) => LoginApi.post(`/auth/login`, user);

export const renewToken = () => LoginApi.get(`/auth/renew`);
```

## Métodos HTTP

### GET - Obtener Datos

```javascript
// GET simple
export const getClients = () => LoginApi.get("/cliente");

// GET con parámetros
export const getClients = (page = 1, pageSize = 10) =>
  LoginApi.get(`/cliente?page=${page}&pageSize=${pageSize}`);

// GET con params object
export const getClients = (params) => LoginApi.get("/cliente", { params });

// GET por ID
export const getClientById = (id) => LoginApi.get(`/cliente/${id}`);
```

### POST - Crear Recursos

```javascript
// POST simple
export const createClient = (data) => LoginApi.post("/cliente", data);

// POST con config adicional
export const uploadFile = (formData) =>
  LoginApi.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
```

### PUT - Actualizar Recursos

```javascript
// PUT completo
export const updateClient = (data) => LoginApi.put(`/cliente/${data.id}`, data);

// PATCH para actualizaciones parciales
export const updateClientStatus = (id, status) =>
  LoginApi.patch(`/cliente/${id}`, { status });
```

### DELETE - Eliminar Recursos

```javascript
// DELETE simple
export const deleteClient = (id) => LoginApi.delete(`/cliente/${id}`);

// DELETE con soft delete (patrón del proyecto)
export const deleteClient = (id, estado = true) =>
  LoginApi.delete(`/cliente/${id}`, { data: { estado } });

// El backend generalmente espera: { estado: false } para desactivar
```

## Patrones Específicos del Proyecto

### Soft Delete

El proyecto usa "soft delete" donde no se elimina el registro, solo se desactiva:

```javascript
export const deleteClientRequest = (id, estado = true) =>
  LoginApi.delete(`/cliente/${id}`, { data: { estado } });

// Uso:
await deleteClientRequest(123, false); // Desactivar
await deleteClientRequest(123, true); // Activar
```

### Paginación

```javascript
export const getClientRequest = (page = 1, pageSize = 10) =>
  LoginApi.get(`/cliente?page=${page}&pageSize=${pageSize}`);

// Respuesta esperada:
// {
//   data: [...],
//   total: 100,
//   page: 1,
//   pageSize: 10
// }
```

### Query Parameters Complejos

```javascript
export const getPrestamosByFilter = ({
  estado,
  fechaInicio,
  fechaFin,
  clienteId,
}) => {
  const params = new URLSearchParams();
  if (estado) params.append("estado", estado);
  if (fechaInicio) params.append("fecha_inicio", fechaInicio);
  if (fechaFin) params.append("fecha_fin", fechaFin);
  if (clienteId) params.append("cliente_id", clienteId);

  return LoginApi.get(`/prestamo?${params.toString()}`);
};
```

## Manejo de Respuestas

### Estructura Típica de Respuesta

```javascript
// Respuesta exitosa
{
  data: {
    usuario: {...},
    token: "eyJhbGc..."
  },
  status: 200
}

// Respuesta con lista
{
  data: {
    data: [...],      // Los registros
    total: 100,
    page: 1,
    pageSize: 10
  }
}

// Respuesta de error
{
  response: {
    data: {
      msg: "Error message",
      errors: {
        email: { msg: "Email inválido" },
        password: { msg: "Password muy corto" }
      }
    },
    status: 400
  }
}
```

### Destructuring en Custom Hooks

```javascript
// Obtener solo data
const { data } = await getClientRequest();

// Obtener data del response anidado
const {
  data: { data: clients },
} = await getClientRequest();

// O mejor, renombrar al hacer destructuring
const { data: response } = await getClientRequest();
const clients = response.data;
```

## Variables de Entorno

### .env.template

```env
VITE_API_URL=http://localhost:3000/api
```

### getEnvVariables.js

```javascript
export const getEnvVariables = () => {
  return {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  };
};
```

### Uso

```javascript
import { getEnvVariables } from "../helpers/getEnvVariables";
const { VITE_API_URL } = getEnvVariables();
```

## Interceptors Avanzados

### Request Interceptor

Ya implementado en el proyecto:

```javascript
LoginApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token"),
  };
  return config;
});
```

### Response Interceptor (opcional)

Para manejar errores globalmente:

```javascript
LoginApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado, redirigir a login
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);
```

## Patrones de Error Handling

### En el Custom Hook

```javascript
const createClient = async (data) => {
  setLoading(true);
  setError(null);
  try {
    const { data: response } = await createClientRequest(data);
    return response;
  } catch (err) {
    // Extraer mensaje de error consistentemente
    setError(err.response?.data?.msg || "Error desconocido");
    return null;
  } finally {
    setLoading(false);
  }
};
```

### Errores de Validación

```javascript
// Backend envía:
{
  errors: {
    email: { msg: "Email inválido" },
    password: { msg: "Password muy corto" }
  }
}

// Frontend maneja:
catch (error) {
  if (error.response?.data?.errors) {
    const { email, password } = error.response.data.errors;
    const msgs = [];
    if (email) msgs.push(email.msg);
    if (password) msgs.push(password.msg);
    setErrors(msgs);
  }
}
```

## Casos Especiales

### Upload de Archivos

```javascript
export const uploadArchivo = (file, prestamoId) => {
  const formData = new FormData();
  formData.append("archivo", file);
  formData.append("prestamo_id", prestamoId);

  return LoginApi.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
```

### Download de Archivos

```javascript
export const downloadArchivo = (id) => {
  return LoginApi.get(`/archivo/${id}`, {
    responseType: "blob",
  });
};

// Uso:
const { data: blob } = await downloadArchivo(id);
const url = window.URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "archivo.pdf";
link.click();
```

### Request con Timeout

```javascript
export const getLongOperation = () => {
  return LoginApi.get("/long-operation", {
    timeout: 30000, // 30 segundos
  });
};
```

## Testing de API Services

```javascript
// Mock simple para testing
jest.mock("../api/clientes", () => ({
  getClientRequest: jest.fn(() => Promise.resolve({ data: { data: [] } })),
  createClientRequest: jest.fn(() =>
    Promise.resolve({ data: { id: 1, nombre: "Test" } }),
  ),
}));
```

## Buenas Prácticas

✅ **Usar** una sola instancia de axios (LoginApi)
✅ **Nunca** hardcodear URLs, usar variables de entorno
✅ **Siempre** usar el interceptor para tokens
✅ **Nombres consistentes**: `get{Entity}Request`, `create{Entity}Request`
✅ **Separar** servicios por módulo de negocio
✅ **Exportar** funciones individuales, no objetos
✅ **Manejar** errores en los custom hooks, no en los servicios
✅ **No** hacer try-catch en los servicios API

## Anti-Patrones

❌ No crear múltiples instancias de axios
❌ No poner lógica de negocio en servicios API
❌ No manejar errores directamente en servicios
❌ No hardcodear tokens en headers
❌ No mezclar diferentes patrones de naming

## Referencias del Proyecto

Ver implementaciones reales en:

- `src/api/settings.js` - Configuración base
- `src/api/auth.js` - Autenticación
- `src/api/clientes.js` - CRUD completo
- `src/api/prestamos.js` - Operaciones complejas
