# AGENTS.md — Hatria Frontend (React + Vite)

> Reglas de oro y mapa de trabajo para agentes que tocan este repositorio. Lee este archivo **antes** de modificar código.

## Qué es

SPA del SaaS **Hatria** (préstamos y cobranzas). React 18 + Vite 5 + Tailwind 3 + Axios + react-hook-form + SweetAlert2 + Leaflet. Consume el API en `../backend` (puerto `3000` por default, configurable vía `VITE_API_URL`).

## Stack y comandos

| Acción | Comando | Notas |
|---|---|---|
| Instalar deps | `npm install` | |
| Dev server | `npm run dev` | Vite, puerto `5173` |
| Build prod | `npm run build` | output en `dist/` |
| Preview build | `npm run preview` | |
| Lint | `npm run lint` | ESLint 9 flat config |
| Tests E2E | `npm run test:e2e` | Playwright (ver `tests/e2e/README.md`) |

## Requisitos

- **Node.js 20+** (Vite 5 requiere ≥18, pero el backend exige 20 — alinear).
- Backend corriendo en `http://localhost:3000` (o donde apunte `VITE_API_URL`).
- `.env` con `VITE_API_URL=http://localhost:3000/api` (con `/api` incluido).

> ⚠️ **Gotcha de Vite**: las variables `VITE_*` se leen **solo al arrancar**. Si cambias `.env`, **reinicia** `npm run dev`. Un valor vacío/mal forma URLs como `http://localhost:5173/auth/undefined/...`.

## Regla #1: Cliente HTTP y token

- **Una sola instancia de axios** configurada en `src/api/settings.js` con `baseURL = VITE_API_URL`.
- El interceptor (`settings.js:9-15`) mete el header `x-token` desde `localStorage.getItem('token')` en **cada** request.
- **Nunca** instancies `axios.create()` en otro archivo. Importa el `LoginApi` de `settings.js` o crea un wrapper de dominio en `src/api/<recurso>.js` que use `LoginApi`.
- El token se guarda en `localStorage` (no `sessionStorage`, no cookie). `AuthContext.checkAuthToken` lo renueva vía `GET /auth/renew` al montar (`src/context/AuthContex.jsx:93-119`).
- En `mapUserFunction` se persisten `usuario` y `token` en `localStorage`. `localStorage.clear()` se llama en logout o en 401 del renew.

## Regla #2: Auth y guards de ruta

Tres componentes de routing en la raíz:

- `ProtectedRoute` (`src/ProtectedRoute.jsx`): envuelve rutas staff, llama `checkAuthToken`, redirige a `/auth/login` si no autenticado. Muestra `<h1>Cargando...</h1>` mientras valida.
- `PublicRoute` (`src/PublicRoute.jsx`): envuelve `/auth/login`, `/auth/register`, `/calculadora`. Catch-all redirige a `/auth/login`.
- `RoleRoute` (`src/RoleRoute.jsx`): restringe por `roles={['super_admin']}` o `roles={['super_admin', 'admin']}`. Usado en `AppRouter.jsx`.

Mapa de rutas → roles está en `AppRouter.jsx:38-103`. El **portal del cliente** (`/portal/:token`) es público y está **fuera** de `ProtectedRoute` (no requiere login de staff).

## Regla #3: Formularios

- **Todos los formularios usan `react-hook-form`** (`useForm`, `Controller`).
- Componentes de input unificados en `src/components/`:
  - `LabeledInput` — input con label, prop `require` y `error`.
  - `FormField` — exporta `LabeledSelect`, `LabeledTextarea`, etc.
  - `Button` — botón con prop `clase` (sí, "clase", no "className" — convención legacy del repo).
- Validación: usar `register('campo', { required: 'mensaje' })` o validaciones con `pattern`, `minLength`, etc. El error sale en `errors.campo`.
- Para selects complejos (cliente, tipo de préstamo): `react-select` envuelto en `Controller`.
- **SweetAlert2 (`Swal`)** para confirmaciones y feedback de éxito/error — no usar `alert()` nativo.

## Regla #4: Estructura por dominio

```
src/
├── api/            # 17 clientes axios por recurso
├── context/        # AuthContext, ConfigContext
├── routes/         # AppRouter.jsx único
├── components/     # UI compartida (Button, Modal, LabeledInput, FormField, ...)
├── auth/           # login + register
├── hooks/          # useApi (loading/error compartido)
├── prestamos/      # clientes, préstamos, pagos, calculadora, refinanciación
│   ├── pages/
│   ├── components/
│   ├── forms/
│   ├── hooks/
│   ├── functions/
│   └── layout/
├── reportes/, usuarios/, admin/, configuracion/, arqueos/,
│   comprobantes/, auditoria/, suscripciones/, portal/, guia/
└── helpers/        # format.js, getEnvVariables.js
```

Cuando agregues un dominio nuevo: crear carpeta `src/<dominio>/` con `pages/`, `components/`, opcionalmente `hooks/`. Registrar cliente axios en `src/api/<recurso>.js`.

## Regla #5: Estado y datos

- **AuthContext** = sesión (`user`, `isAuthenticated`, `isLoading`, `errors`, `singIn`, `signup`, `checkAuthToken`).
- **ConfigContext** = config global del sistema (moneda, código de país, etc.).
- **useApi** = hook genérico para requests con `loading`/`error` (en `src/hooks/useApi.js`). Devuelve `null` si falla, `data` si OK.
- Custom hooks por dominio en `src/<dominio>/hooks/`: encapsulan el cliente axios del recurso + loading/error local. Ejemplo: `useLoan`, `useClient`.

## Convenciones de código

- **JSX, no TSX**. El proyecto no usa TypeScript.
- **Componentes funcionales** con hooks. No class components.
- **Props de estilo**: en `Button` y otros componentes propios usan `clase` (string de Tailwind). En elementos HTML nativos: `className`.
- **Iconos**: `lucide-react` (`import { Icon } from 'lucide-react'`).
- **Mapas**: `react-leaflet` (clientes con `lat/lng`).
- **Exportes de PDF**: `jspdf` + `jspdf-autotable` (recibos).
- **Exportes de Excel**: `xlsx`.
- **Fechas**: `date-fns` (formato `import { format } from 'date-fns'`).
- **Toasts/alertas**: `sweetalert2` (`Swal.fire({...})`).
- Estilos: clases Tailwind inline, no CSS modules. Tema en `tailwind.config.js`.

## Variables de entorno

- `VITE_API_URL` — **obligatoria**. URL completa del backend incluyendo `/api` (ej. `http://localhost:3000/api`).
- Si está vacía, el login falla con URLs tipo `http://localhost:5173/auth/undefined/...`. **Reiniciar Vite tras cambiar.**

## Tests E2E

- Suite: `tests/e2e/` con `@playwright/test`.
- 5 flujos críticos cubiertos: login, crear préstamo, registrar pago, cierre de arqueo, portal del cliente con comprobante.
- Requieren backend + frontend levantados. Ver `tests/e2e/README.md` para cómo correr.
- **No** añadir tests unitarios con Jest/Vitest. El proyecto no tiene y合意 no ha pedido esa capa; si la necesitas, coordinar antes con el dueño.

## Endurecimiento pendiente (no ignorar al tocar)

1. **Token en `localStorage`**: vulnerable a XSS. Considerar migrar a cookie `httpOnly` cuando el backend lo soporte.
2. **No hay tests de componentes** (Vitest/Testing Library). Los E2E cubren los flujos críticos pero no componentes sueltos.
3. **JSX sin TypeScript**: muchos props sin tipo. JSDoc ayuda pero no es enforcement.

## Cómo añadir una página nueva (checklist)

1. Crear componente en `src/<dominio>/pages/<Nombre>Page.jsx`. Exportar como named export.
2. Si usa axios: cliente en `src/api/<recurso>.js` (importa `LoginApi` de `settings.js`).
3. Registrar ruta en `src/routes/AppRouter.jsx` dentro del bloque correspondiente:
   - Staff: dentro de `<Route element={<ProtectedRoute />}>`.
   - Con restricción de rol: envolver en `<Route element={<RoleRoute roles={[...]} />}>`.
   - Pública: dentro de `<Route element={<PublicRoute />}>`.
4. Si necesita form: usar `react-hook-form` + `LabeledInput`/`FormField`.
5. Si necesita feedback: `Swal.fire({...})`.
6. Si toca un flujo crítico, agregar test E2E en `tests/e2e/`.

## No hacer

- **No** instancies `axios` directo. Importa `LoginApi` de `src/api/settings.js`.
- **No** uses `alert()` o `confirm()` nativos. `Swal.fire({...})`.
- **No** leas `localStorage` directo fuera de `AuthContext` y `settings.js`. Centralizar el acceso al token.
- **No** metas CSS modules ni styled-components. Tailwind inline.
- **No** introduzcas TypeScript sin согласованно con el dueño.
- **No** commitees `.env` (ya está en `.gitignore`).
