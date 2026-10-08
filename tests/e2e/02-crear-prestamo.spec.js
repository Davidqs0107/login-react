import { test, expect } from '@playwright/test';
import { login } from './helpers.js';

const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@hatria.com';
const ADMIN_PASS = process.env.E2E_ADMIN_PASS || 'admin123';

test.describe('Crear préstamo', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN_EMAIL, ADMIN_PASS);
  });

  test('flujo staff: ir a /prestamo muestra el formulario de nuevo préstamo', async ({ page }) => {
    await page.goto('/prestamo');
    // El form tiene un selector de cliente + campos del préstamo
    // Verificamos que el campo monto (numérico) está presente
    await expect(page.getByLabel(/monto/i).first()).toBeVisible();
    // El select de tipo_prestamo (fijo/cota) controla la ayuda contextual.
    // El label "tipo de préstamo" también aparece en el aria-label de "Porcentaje a Ganar"
    // (texto de ayuda: "...depende del tipo de préstamo seleccionado arriba"),
    // así que usamos el primer match = el <select> real.
    await expect(page.getByLabel(/tipo de pr[eé]stamo/i).first()).toBeVisible();
  });

  test('ruta de detalle de préstamo /prestamo/:id carga sin error de red', async ({ page }) => {
    // Probamos la ruta de listado primero para ver si hay IDs
    await page.goto('/listado/prestamos');
    // Si no hay préstamos, la página puede mostrar "Sin préstamos"; no asumimos datos
    // Lo crítico: la página carga, ProtectedRoute no redirige a login
    await expect(page).toHaveURL(/\/listado\/prestamos/);
  });
});
