import { expect, test } from '@playwright/test';

test('uses the system and persisted theme preferences before rendering', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('[data-theme-toggle]')).toHaveAccessibleName('Theme: Dark');

  await page.evaluate(() => localStorage.setItem('codemade-theme', 'light'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('[data-theme-toggle]')).toHaveAccessibleName('Theme: Light');
});

test('refreshes comments with the selected theme', async ({ page }) => {
  await page.goto('/blog/building-for-one/');
  const comments = page.locator('#comments-container iframe');
  await expect(comments).toHaveAttribute('src', /theme=dark|theme=light/);

  const toggle = page.locator('[data-theme-toggle]');
  await toggle.click();
  await expect(comments).toHaveAttribute('src', /theme=dark/);
  await toggle.click();
  await expect(comments).toHaveAttribute('src', /theme=light/);
});

test('only requests Mermaid on posts that contain diagrams and rerenders it on theme changes', async ({ page }) => {
  let mermaidRequests = 0;
  await page.route('**/mermaid.min.js', async route => {
    mermaidRequests += 1;
    await route.fulfill({
      contentType: 'application/javascript',
      body: `window.mermaid = {
        initialize: options => { window.mermaidTheme = options.theme; },
        render: async () => ({ svg: '<svg data-theme="' + window.mermaidTheme + '"></svg>' })
      };`
    });
  });

  await page.goto('/blog/building-for-one/');
  await page.waitForTimeout(100);
  expect(mermaidRequests).toBe(0);

  await page.goto('/blog/my-docker-setup-in-2025/');
  await expect(page.locator('.mermaid svg').first()).toHaveAttribute('data-theme', /dark|default/);
  expect(mermaidRequests).toBe(1);
  const toggle = page.locator('[data-theme-toggle]');
  await toggle.click();
  await expect(page.locator('.mermaid svg').first()).toHaveAttribute('data-theme', 'dark');
  await toggle.click();
  await expect(page.locator('.mermaid svg').first()).toHaveAttribute('data-theme', 'default');
});

test('keeps navigation and theme controls in the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  const [nav, theme, links] = await Promise.all([
    page.locator('nav').boundingBox(),
    page.locator('.theme-control').boundingBox(),
    page.locator('nav ul').boundingBox()
  ]);
  expect(theme.x + theme.width).toBeLessThanOrEqual(nav.x + nav.width);
  expect(links.y).toBeLessThanOrEqual(theme.y + theme.height);
});
