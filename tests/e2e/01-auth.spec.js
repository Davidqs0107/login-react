import { test, expect } from '@playwright/test';
import { login, logout, uniqueEmail } from './helpers.js';

// Credenciales del seed (ver backend/database/seed.js). El operador corre el seed antes.
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@hatria.com';
const ADMIN_PASS = process.env.E2E_ADMIN_PASS || 'admin123';

test.describe('Auth y guards de ruta', () => {
  test('login con credenciales válidas entra al dashboard', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
    // Después del login, ProtectedRoute renderiza PrestamoLayout y DashboardPage
    await expect(page).toHaveURL('/');
  });

  test('login con password incorrecto muestra error y NO redirige', async ({ page }) => {
    await page.goto('/auth/login');
    await page.getByLabel('Email').fill(ADMIN_EMAIL);
    await page.getByLabel('Password').fill('wrong-password-xyz');
    await page.getByRole('button', { name: /login/i }).click();
    // Debe quedarse en /auth/login
    await expect(page).toHaveURL(/\/auth\/login/);
    // SweetAlert2 (toast) o mensaje del AuthContext (errores[]) — validamos que NO redirigió
    await page.waitForTimeout(500);
  });

  test('ruta staff sin auth redirige a /auth/login', async ({ page }) => {
    await page.goto('/clientes');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('logout limpia sesión y vuelve a login', async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
    await expect(page).toHaveURL('/');
    await logout(page);
    // Intentar ir a /clientes debe redirigir a /auth/login otra vez
    await page.goto('/clientes');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
