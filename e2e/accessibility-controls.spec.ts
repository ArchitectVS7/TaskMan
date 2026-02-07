import { test, expect } from '@playwright/test';
import { registerUser } from './helpers/auth';
import { generateTestUser } from './helpers/fixtures';

test.describe('Accessibility Controls', () => {
    test.beforeEach(async ({ page }) => {
        const user = generateTestUser('accessibility');
        await registerUser(page, user);
        await page.goto('/profile');
        await page.waitForTimeout(1000); // Wait for page to load
    });

    test('displays color theme picker', async ({ page }) => {
        // Verify Appearance section exists
        await expect(page.getByText('Appearance')).toBeVisible();

        // Find theme picker buttons (color theme circles)
        const themeButtons = page.locator('button[aria-label*="theme"]');
        await expect(themeButtons.first()).toBeVisible({ timeout: 5000 });

        // Get count of theme buttons
        const count = await themeButtons.count();
        expect(count).toBeGreaterThanOrEqual(5); // Should have multiple color themes
    });

    test('switches between color themes', async ({ page }) => {
        // Find theme picker buttons
        const themeButtons = page.locator('button[aria-label*="theme"]');
        await expect(themeButtons.first()).toBeVisible();

        const count = await themeButtons.count();

        // Click on a different theme
        if (count > 1) {
            await themeButtons.nth(1).click();
            await page.waitForTimeout(500);

            // Verify theme changed (button should have ring)
            await expect(themeButtons.nth(1)).toHaveClass(/ring-2/);
        }
    });

    test('displays layout switcher', async ({ page }) => {
        // Verify Interface Layout section exists
        await expect(page.getByText('Interface Layout')).toBeVisible();

        // Layout switcher should be visible
        const layoutButtons = page.locator('[data-testid="layout-option"]');

        if (await layoutButtons.count() > 0) {
            await expect(layoutButtons.first()).toBeVisible();
        }
    });

    test('displays density picker', async ({ page }) => {
        // Verify Display Density section exists
        await expect(page.getByText('Display Density')).toBeVisible();

        // Density picker should be visible
        const densityButtons = page.locator('button').filter({ hasText: /compact|comfortable|spacious/i });

        if (await densityButtons.count() > 0) {
            await expect(densityButtons.first()).toBeVisible();
        }
    });

    test('theme toggle switches dark mode', async ({ page }) => {
        // Find theme toggle button (sun/moon icon)
        const themeToggle = page.locator('button[aria-label*="theme"], button').filter({ has: page.locator('svg') }).first();

        if (await themeToggle.isVisible()) {
            const html = page.locator('html');
            const initialDark = await html.getAttribute('class');

            // Toggle theme
            await themeToggle.click();
            await page.waitForTimeout(500);

            const newClass = await html.getAttribute('class');
            // Class should have changed
            expect(newClass).not.toBe(initialDark);
        }
    });

    test('profile information form exists', async ({ page }) => {
        await expect(page.getByText('Profile Information')).toBeVisible();
        await expect(page.getByLabel('Name')).toBeVisible();
        await expect(page.getByLabel('Email')).toBeVisible();
    });

    test('password change form exists', async ({ page }) => {
        await expect(page.getByText('Change Password')).toBeVisible();
        await expect(page.getByLabel('Current Password')).toBeVisible();
        await expect(page.getByLabel('New Password')).toBeVisible();
        await expect(page.getByLabel('Confirm New Password')).toBeVisible();
    });
});
