// Helpers compartidos por los tests E2E de Hatria.

/**
 * Hace login con email/password y espera a que el dashboard cargue.
 * Asume que el usuario ya existe (creado por `npm run seed` en backend).
 */
export async function login(page, email, password) {
  await page.goto('/auth/login');
  // waitForLoadState por si la app tarda en montar
  await page.waitForLoadState('domcontentloaded');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
  // ProtectedRoute redirige a / cuando auth OK
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/'), { timeout: 10_000 });
}

/**
 * Logout: limpia localStorage y va a /auth/login.
 * Útil para tests que validan guards.
 */
export async function logout(page) {
  await page.evaluate(() => localStorage.clear());
  await page.goto('/auth/login');
}

/**
 * Genera un email único por run para evitar choques con datos existentes.
 */
export function uniqueEmail(prefix = 'e2e') {
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  return `${prefix}-${stamp}@hatria.test`;
}
