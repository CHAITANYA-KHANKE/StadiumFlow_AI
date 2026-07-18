import { test, expect } from '@playwright/test';

test.describe('StadiumFlow E2E Smoke Tests', () => {
  
  test('should load the home landing page and show key cards', async ({ page }) => {
    await page.goto('/');
    
    // Check main title
    await expect(page.locator('text=STADIUMFLOW AI').first()).toBeVisible();
    
    // Check navigation buttons are visible
    await expect(page.locator('text=Launch Fan Portal')).toBeVisible();
    await expect(page.locator('text=Enter Command Console')).toBeVisible();
    await expect(page.locator('text=Launch Volunteer Hub')).toBeVisible();
  });

  test('should navigate to operations command center and click a zone', async ({ page }) => {
    await page.goto('/operations');
    
    // Wait for the SVG map to be visible
    await expect(page.locator('svg[viewBox="0 0 800 440"]')).toBeVisible();
    
    // Verify top KPIs
    await expect(page.locator('text=Total Stadium Crowd')).toBeVisible();
    await expect(page.locator('text=Active Inflow Rate')).toBeVisible();
    
    // Click on North Concourse zone text or path in the SVG
    await page.locator('text=NORTH CONCOURSE').first().click({ force: true });
    
    // Check that details panel loads
    await expect(page.locator('text=Operations Briefing Detail')).toBeVisible();
  });

  test('should calculate route on navigate page', async ({ page }) => {
    await page.goto('/navigate');
    
    // Verify autocomplete selects exist
    const startSelect = page.locator('#start-poi-select');
    const endSelect = page.locator('#end-poi-select');
    
    await expect(startSelect).toBeVisible();
    await expect(endSelect).toBeVisible();
    
    // Select starting and ending points
    await startSelect.selectOption({ label: 'Gate A (Main Entry) (GATE)' });
    await endSelect.selectOption({ label: 'Restroom Block South (RESTROOM)' });
    
    // Click calculate
    await page.locator('text=Calculate Route').click();
    
    // Verify route calculations appear
    await expect(page.locator('text=minutes walk')).toBeVisible();
    await expect(page.locator('text=Directions & Segment Breakdown')).toBeVisible();
  });

  test('should open assistant page and check language greeting', async ({ page }) => {
    await page.goto('/assistant');
    
    // Verify the default welcome message
    await expect(page.locator('text=StadiumFlow Fan Assistant')).toBeVisible();
    
    // Verify suggested followup questions exist
    await expect(page.locator('button:has-text("Where is the nearest first aid?")')).toBeVisible();
  });
});
