import { type Page, expect } from '@playwright/test';

interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}

export async function registerUser(page: Page, user: UserCredentials): Promise<void> {
  await page.goto('/register');
  await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();

  await page.getByLabel('Name').fill(user.name || 'Test User');
  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password', { exact: true }).fill(user.password);
  await page.getByLabel('Confirm password').fill(user.password);

  await page.getByRole('button', { name: 'Create account' }).click();

  // Wait for redirect to dashboard
  await expect(page).toHaveURL('/', { timeout: 15_000 });
}

export async function loginUser(page: Page, user: UserCredentials): Promise<void> {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

  await page.getByLabel('Email').fill(user.email);
  await page.getByLabel('Password').fill(user.password);

  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/', { timeout: 15_000 });
}

export async function logout(page: Page): Promise<void> {
  await page.getByTitle('Logout').click();
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible({
    timeout: 10_000,
  });
}
