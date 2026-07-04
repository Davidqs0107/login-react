# Hatria — Frontend

SPA (single-page app) del sistema de préstamos y cobranzas **Hatria**. Consume el API REST del backend (`../01-loginJS`).

## Stack

- **React 18** + **Vite**
- **React Router 7**
- **TailwindCSS**
- **Axios** (cliente HTTP con interceptor de token)
- **react-hook-form** (formularios)
- **SweetAlert2** (diálogos)
- **Leaflet** / react-leaflet (mapas de clientes)
- **jsPDF** + **xlsx** (exportar recibos y reportes)
- **lucide-react** (iconos)

## Requisitos

- Node.js 20+
- El backend corriendo (por defecto en `http://localhost:3000`)

## Puesta en marcha

```bash
# 1. Dependencias
npm install

# 2. Variables de entorno
cp .env.template .env
```

Edita `.env` y define la URL del API **incluyendo `/api`**:

```env
VITE_API_URL=http://localhost:3000/api
```

> ⚠️ **Importante:** si `VITE_API_URL` está vacío o mal, el login falla con URLs tipo `http://localhost:5173/auth/undefined/...`. Vite solo lee las variables `VITE_*` **al arrancar**, así que si cambias el `.env` debes **reiniciar** `npm run dev`.

```bash
# 3. Servidor de desarrollo
npm run dev        # http://localhost:5173
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build de producción a `dist/` |
| `npm run preview` | Sirve el build para previsualizar |
| `npm run lint` | ESLint |

## Autenticación

- El token JWT se guarda en `localStorage` y se envía en cada request en el header `x-token` (interceptor en `src/api/settings.js`).
- Rutas protegidas envueltas por `ProtectedRoute`; rutas públicas por `PublicRoute`.
- El **portal del cliente** (`/portal/:token`) es una ruta pública independiente (sin login de staff).

## Estructura (por dominio)

```
src/
├── api/            # clientes axios por recurso (auth, clientes, prestamos, arqueos, ...)
├── context/        # AuthContext (sesión, login/logout)
├── routes/         # AppRouter (definición de rutas)
├── components/     # UI compartida (Sidebar, Modal, LoaderLocal, ...)
├── auth/           # login y registro
├── prestamos/      # clientes, préstamos, pagos, calculadora, refinanciación
├── reportes/       # pantallas de reportes
├── usuarios/       # gestión de usuarios / perfil
├── admin/          # empresas y planes (super_admin)
├── configuracion/  # ajustes de mora e incumplimiento (admin)
├── arqueos/        # cierre de caja
├── comprobantes/   # validación de comprobantes del portal
├── auditoria/      # bitácora
├── suscripciones/  # panel + banner de vencimiento
├── portal/         # portal público del cliente
└── guia/           # pantalla "¿Cómo funciona?" (onboarding por rol)
```

## Rutas principales

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Dashboard | staff |
| `/guia` | ¿Cómo funciona? | admin / cobrador |
| `/clientes` | Clientes (con score y enlace al portal) | staff |
| `/prestamo` · `/prestamo/:id` | Crear / detalle de préstamo | staff |
| `/pagos` | Pagos | admin |
| `/arqueos` | Arqueo de caja | staff |
| `/comprobantes` | Comprobantes del portal | staff |
| `/configuracion` | Configuración de mora | admin |
| `/auditoria` | Bitácora | admin |
| `/reportes/*` | Reportes | staff |
| `/admin/empresas` · `/admin/planes` · `/admin/suscripciones` | Panel super_admin | super_admin |
| `/portal/:token` | Portal del cliente | público (por token) |
```
