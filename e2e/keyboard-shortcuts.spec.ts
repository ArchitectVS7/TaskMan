import { test, expect } from '@playwright/test';
import { registerUser } from './helpers/auth';
import { generateTestUser } from './helpers/fixtures';

test.describe('Keyboard Shortcuts Modal', () => {
    test.beforeEach(async ({ page }) => {
        const user = generateTestUser('shortcuts');
        await registerUser(page, user);
        await page.goto('/');
        await page.waitForTimeout(1000); // Wait for page to fully load
    });

    test('opens modal with ? key', async ({ page }) => {
        // Press Shift+/ which produces ?
        await page.keyboard.press('Shift+Slash');

        // Verify modal opens
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).toBeVisible({ timeout: 3000 });
    });

    test('closes modal with Escape key', async ({ page }) => {
        // Open modal
        await page.keyboard.press('Shift+Slash');
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).toBeVisible();

        // Close with Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).not.toBeVisible();
    });

    test('closes modal with close button', async ({ page }) => {
        // Open modal
        await page.keyboard.press('Shift+Slash');
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).toBeVisible();

        // Click X button
        const closeButton = page.locator('button').filter({ has: page.locator('svg') }).last();
        await closeButton.click();
        await page.waitForTimeout(500);
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).not.toBeVisible();
    });

    test('displays navigation shortcuts category', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');

        // Verify navigation section exists (uppercase in actual implementation)
        await expect(page.getByText('Navigation', { exact: false })).toBeVisible();

        // Verify specific navigation shortcuts
        await expect(page.getByText(/dashboard/i)).toBeVisible();
        await expect(page.getByText(/tasks/i)).toBeVisible();
    });

    test('displays general shortcuts category', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');

        // Verify general section (uppercase in actual implementation)
        await expect(page.getByText('General', { exact: false })).toBeVisible();

        // Verify specific shortcuts
        await expect(page.getByText(/keyboard shortcuts/i)).toBeVisible();
        await expect(page.getByText(/command palette/i)).toBeVisible();
    });

    test('displays command palette shortcut', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');

        // Verify command palette shortcut is shown (Ctrl+K or ⌘+K)
        const shortcutText = await page.locator('kbd').filter({ hasText: /K/i }).first();
        await expect(shortcutText).toBeVisible();
    });

    test('shortcut keys are formatted with kbd elements', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');

        // Verify keyboard key styling
        const keyElements = page.locator('kbd');
        expect(await keyElements.count()).toBeGreaterThan(0);

        // Verify keys have distinct styling
        const firstKey = keyElements.first();
        await expect(firstKey).toBeVisible();
        await expect(firstKey).toHaveClass(/bg-gray/);
    });

    test('shows platform-specific modifiers', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');

        // Check for Ctrl or ⌘ based on platform
        const kbdElements = page.locator('kbd');
        const kbdText = await kbdElements.allTextContents();
        const allText = kbdText.join(' ');

        // Should show either Ctrl (Windows/Linux) or ⌘ (Mac)
        const hasCtrl = allText.includes('Ctrl');
        const hasCmd = allText.includes('⌘');

        expect(hasCtrl || hasCmd).toBeTruthy();
    });

    test('groups shortcuts by category', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');

        // Verify multiple category headings exist
        await expect(page.getByText('GENERAL')).toBeVisible();
        await expect(page.getByText('NAVIGATION')).toBeVisible();
        await expect(page.getByText('COMMAND PALETTE')).toBeVisible();
    });

    test('clicking outside modal closes it', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).toBeVisible();

        // Click outside modal (on backdrop)
        await page.mouse.click(10, 10);
        await page.waitForTimeout(500);

        // Modal should close
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).not.toBeVisible();
    });

    test('modal has proper structure', async ({ page }) => {
        await page.keyboard.press('Shift+Slash');

        // Verify modal structure
        await expect(page.getByRole('heading', { name: /keyboard shortcuts/i })).toBeVisible();

        // Should have footer with hint
        await expect(page.getByText(/press.*\?.*anytime/i)).toBeVisible();
    });
});
