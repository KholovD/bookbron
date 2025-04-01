import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers/auth';
import { createTestComputer } from './helpers/factories';

test.describe('Computer Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should display computer grid', async ({ page }) => {
    await page.goto('/dashboard');
    
    const computerGrid = page.locator('[data-testid="computer-grid"]');
    await expect(computerGrid).toBeVisible();
    
    const computers = await page.locator('[data-testid="computer-item"]').all();
    expect(computers.length).toBeGreaterThan(0);
  });

  test('should start computer session', async ({ page }) => {
    const computer = await createTestComputer();
    await page.goto('/dashboard');

    await page.click(`[data-testid="computer-${computer.id}"]`);
    await page.click('[data-testid="start-session-btn"]');
    
    await page.fill('[data-testid="user-input"]', 'Test User');
    await page.click('[data-testid="confirm-btn"]');

    await expect(page.locator(`[data-testid="computer-${computer.id}-status"]`))
      .toHaveText('Active');
  });

  test('should end computer session', async ({ page }) => {
    const computer = await createTestComputer({ status: 'active' });
    await page.goto('/dashboard');

    await page.click(`[data-testid="computer-${computer.id}"]`);
    await page.click('[data-testid="end-session-btn"]');
    await page.click('[data-testid="confirm-btn"]');

    await expect(page.locator(`[data-testid="computer-${computer.id}-status"]`))
      .toHaveText('Available');
  });
}); 