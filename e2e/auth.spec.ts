import { test, expect } from '@playwright/test';
import { registerUser, loginUser, logout } from './helpers/auth';
import { generateTestUser } from './helpers/fixtures';

test.describe('Authentication', () => {
  test('user can register a new account', async ({ page }) => {
    const user = generateTestUser('register');

    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();

    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password', { exact: true }).fill(user.password);
    await page.getByLabel('Confirm password').fill(user.password);

    await page.getByRole('button', { name: 'Create account' }).click();

    // Should redirect to the dashboard
    await expect(page).toHaveURL('/', { timeout: 15_000 });
    await expect(page.getByText(user.name)).toBeVisible();
  });

  test('user can log in with valid credentials', async ({ page }) => {
    const user = generateTestUser('login');
    await registerUser(page, user);
    await logout(page);
    await loginUser(page, user);
    await expect(page).toHaveURL('/');
  });

  test('user is redirected to login when not authenticated', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('user can log out', async ({ page }) => {
    const user = generateTestUser('logout');
    await registerUser(page, user);
    await logout(page);

    // Verify cannot access protected routes
    await page.goto('/tasks');
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test('shows error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('nonexistent@test.local');
    await page.getByLabel('Password').fill('WrongPass123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    const errorAlert = page.locator('[class*="bg-red"]');
    await expect(errorAlert).toBeVisible({ timeout: 5_000 });
  });

  test('shows error when passwords do not match on register', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('mismatch@test.local');
    await page.getByLabel('Password', { exact: true }).fill('TestPass123!');
    await page.getByLabel('Confirm password').fill('DifferentPass123!');
    await page.getByRole('button', { name: 'Create account' }).click();

    const errorAlert = page.locator('[class*="bg-red"]');
    await expect(errorAlert).toBeVisible();
    await expect(errorAlert).toContainText('Passwords do not match');
  });

  test('login page has link to register', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
  });

  test('register page has link to login', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });
});
