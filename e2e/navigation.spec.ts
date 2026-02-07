import { test, expect } from '@playwright/test';
import { registerUser } from './helpers/auth';
import { generateTestUser } from './helpers/fixtures';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    const user = generateTestUser('nav');
    await registerUser(page, user);
  });

  test('sidebar shows all navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Calendar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Focus' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Creators' })).toBeVisible();
  });

  test('can navigate to Tasks page', async ({ page }) => {
    await page.getByRole('link', { name: 'Tasks' }).click();
    expect(page.url()).toContain('/tasks');
  });

  test('can navigate to Projects page', async ({ page }) => {
    await page.getByRole('link', { name: 'Projects' }).click();
    expect(page.url()).toContain('/projects');
  });

  test('can navigate to Calendar page', async ({ page }) => {
    await page.getByRole('link', { name: 'Calendar' }).click();
    expect(page.url()).toContain('/calendar');
  });

  test('can navigate back to Dashboard', async ({ page }) => {
    await page.getByRole('link', { name: 'Tasks' }).click();
    await page.getByRole('link', { name: 'Dashboard' }).click();
    expect(page.url()).toMatch(/\/$/);
  });
});
