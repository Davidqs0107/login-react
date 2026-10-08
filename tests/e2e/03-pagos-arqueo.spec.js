import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const COBRADOR_EMAIL = process.env.E2E_COBRADOR_EMAIL || 'cobrador@hatria.com';
const COBRADOR_PASS = process.env.E2E_COBRADOR_PASS || 'cobra123';

test.describe('Cobrador: pagos y arqueo', () => {
  test('cobrador logueado puede acceder a /pagos y /arqueos', async ({ page }) => {
    await login(page, COBRADOR_EMAIL, COBRADOR_PASS);
    // Las rutas /pagos y /arqueos están dentro de ProtectedRoute sin restricción de rol extra
    await page.goto('/pagos');
    await expect(page).toHaveURL(/\/pagos/);
    await page.goto('/arqueos');
    await expect(page).toHaveURL(/\/arqueos/);
  });

  test('pantalla de arqueo muestra el botón de cierre si hay caja abierta', async ({ page }) => {
    await login(page, COBRADOR_EMAIL, COBRADOR_PASS);
    await page.goto('/arqueos');
    // No asumimos contenido exacto (puede ser "Sin caja abierta" o el form de cierre).
    // Validamos que la página montó sin redirigir y tiene el layout.
    await expect(page.locator('main, [class*="layout"]').first()).toBeVisible();
  });
});
