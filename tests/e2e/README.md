# Tests E2E — Hatria Frontend

Suite smoke de Playwright que cubre los **5 flujos críticos** del sistema. No es una suite exhaustiva: valida que las rutas, los guards de autenticación y los puntos de entrada públicos funcionan end-to-end con el backend real.

## Flujos cubiertos

| # | Spec | Qué valida |
|---|---|---|
| 1 | `01-auth.spec.js` | Login OK, login con error, redirect de rutas staff sin auth, logout limpia sesión |
| 2 | `02-crear-prestamo.spec.js` | Pantalla `/prestamo` muestra el form completo, ruta de detalle carga |
| 3 | `03-pagos-arqueo.spec.js` | Cobrador accede a `/pagos` y `/arqueos`, pantalla de arqueo monta |
| 4 | `04-rutas-rol.spec.js` | Admin accede a `/usuarios`, `/configuracion`, `/auditoria`, `/empresa`. `/admin/*` valida guard de super_admin |
| 5 | `05-portal-cliente.spec.js` | Portal público (`/portal/:token`) NO requiere login, token inválido muestra error |

## Requisitos antes de correr

1. **Backend corriendo** en `http://localhost:3000`:
   ```bash
   cd ../backend
   npm install
   npm run seed     # una sola vez, crea admin@hatria.com y cobrador@hatria.com
   npm run dev
   ```

2. **Frontend corriendo** en `http://localhost:5173`:
   ```bash
   # desde esta carpeta
   npm run dev
   ```

3. **Browsers de Playwright** ya instalados (Chromium). Si falta:
   ```bash
   npx playwright install chromium
   ```

## Cómo correr

```bash
# Suite completa (5 specs, secuenciales)
npm run test:e2e

# Un spec puntual
npx playwright test tests/e2e/01-auth.spec.js

# Con interfaz visual (debug)
npx playwright test --ui

# Ver reporte HTML del último run
npx playwright show-report
```

## Credenciales por defecto

Los tests leen de variables de entorno, con defaults:

| Variable | Default | Rol |
|---|---|---|
| `E2E_ADMIN_EMAIL` | `admin@hatria.com` | admin |
| `E2E_ADMIN_PASS` | `admin123` | admin |
| `E2E_COBRADOR_EMAIL` | `cobrador@hatria.com` | cobrador |
| `E2E_COBRADOR_PASS` | `cobra123` | cobrador |

Sobreescribir si tu seed usa otros emails. Ejemplo:
```bash
E2E_ADMIN_EMAIL=yo@mitest.com E2E_ADMIN_PASS=secreto npm run test:e2e
```

## Configuración

`playwright.config.js` (en la raíz del frontend):
- `baseURL` lee de `FRONTEND_URL` (default `http://localhost:5173`).
- `workers: 1` y `fullyParallel: false` para evitar choques entre tenants (Hatria es multi-tenant por `empresa_id`).
- `timeout: 30s` por test, `expect: 5s`.
- Trace + screenshot + video solo en retry/failure (no infla artifacts en CI verde).

## Filosofía

- **Smoke, no exhaustivo**: cada spec cubre "el camino feliz + 1 caso de error obvio". Para unit tests de componentes, agregar Vitest + Testing Library (decisión pendiente del dueño).
- **Datos reales del seed**: no mockeamos el backend. Esto valida también la integración FE↔BE (CORS, `x-token`, formato de respuestas, errores de validación).
- **Sin flakiness por timing**: usamos `waitForURL`, `toBeVisible`, `getByLabel`/`getByRole` (no selectores frágiles por CSS).

## Próximos pasos sugeridos

1. **Crear datos de prueba programáticamente** vía API en `beforeAll` (cliente, préstamo) en vez de depender del seed.
2. **Agregar specs para flujos completos**: crear préstamo → registrar pago → verificar estado de cuota; crear cliente → generar token de portal → subir comprobante.
3. **CI en GitHub Actions** que levante backend + postgres + frontend y corra la suite.
4. **Migrar a Vitest** para tests de componentes (Button, LabeledInput, helpers de cálculo de cuotas en `src/prestamos/functions/`).
