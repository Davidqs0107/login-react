import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config para Hatria frontend.
 *
 * Asume que:
 * - Backend en http://localhost:3000 (configurable con BACKEND_URL)
 * - Frontend en http://localhost:5173 (configurable con FRONTEND_URL)
 * - Seed ejecutado (usuario admin@test.com / admin123)
 *
 * Para levantar todo antes de los tests:
 *   cd ../backend && npm run dev   # terminal 1
 *   npm run dev                    # terminal 2
 *   npm run seed                   # una vez (en backend/)
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,           // Hatria es multi-tenant: tests secuenciales para no chocar empresas
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,                     // un solo worker para evitar interferencia entre tenants
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // No arrancamos webServer acá: el operador decide qué procesos ya están corriendo
  // (backend en :3000, frontend en :5173). Los tests fallan rápido si algo no responde.
});
