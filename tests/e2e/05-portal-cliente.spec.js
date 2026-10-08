import { test, expect } from '@playwright/test';

// El portal del cliente es PÚBLICO: no requiere login de staff.
// Se accede por token en /portal/:token. La URL del token se genera desde el backend
// (en la pantalla de detalle de cliente, hay un botón "Copiar enlace del portal").
//
// Para este test de smoke validamos:
// 1. La ruta /portal/<cualquier-token> renderiza SIN redirigir a /auth/login.
// 2. Con un token inválido, muestra el mensaje de error "El enlace no es válido o expiró."
//    (ver src/portal/pages/PortalPage.jsx:29).

test.describe('Portal público del cliente', () => {
  test('ruta /portal/:token es pública y no redirige a login', async ({ page }) => {
    // Usamos un token dummy. La página cargará y mostrará el error de token inválido.
    await page.goto('/portal/test-token-no-valido-xyz');
    // La URL debe seguir siendo /portal/...
    await expect(page).toHaveURL(/\/portal\//);
    // ProtectedRoute no debe haber capturado la navegación
    await page.waitForLoadState('domcontentloaded');
    expect(page.url()).not.toContain('/auth/login');
  });

  test('portal con token inválido muestra mensaje de error', async ({ page }) => {
    await page.goto('/portal/token-que-no-existe-12345');
    // Esperar a que el getResumen falle y se setee el error
    await expect(page.getByText(/enlace no es v[aá]lido|expir[oó]/i)).toBeVisible({ timeout: 10_000 });
  });

  test('portal NO requiere token en localStorage', async ({ page, context }) => {
    // Limpiamos storage completamente
    await context.clearCookies();
    await page.goto('about:blank');
    await page.evaluate(() => localStorage.clear()).catch(() => {});
    // Y navegamos al portal directamente
    await page.goto('/portal/cualquier-token');
    await expect(page).toHaveURL(/\/portal\//);
  });
});
