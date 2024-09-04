import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: '[Log In]' }).click();
    await page.getByPlaceholder('Username').fill('Anonymous');
    await page.getByPlaceholder('Password').fill('asdf');
    await page.getByRole('button', { name: 'Log In' }).click();

    await expect(page.getByRole('link', { name: 'Anonymous' })).toBeVisible();
});
