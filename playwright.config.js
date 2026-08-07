import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:8081',
    headless: true
  },
  webServer: {
    command: 'npx @11ty/eleventy --serve --port=8081',
    url: 'http://127.0.0.1:8081',
    reuseExistingServer: !process.env.CI
  }
});
