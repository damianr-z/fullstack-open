const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith } = require('./helper');

// DONE: 5.17
describe('Blog app', () => {

  let testUser = {
    name: 'Alexandre',
    username: 'xerox2',
    password: 'aventure',
  };

  beforeEach(async ({ page, request }) => {
    await page.addInitScript(() => {
      window.sessionStorage.clear();
      window.localStorage.clear();
    });

    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: testUser,
    });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(form.getByRole('button', { name: /login/i })).toBeVisible();
  });

  // DONE: 5.18
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password);
      await expect(page.locator('body')).toContainText(/logged-in/i);
    });

    test('fails with wrong credentials', async ({ page }) => {
      const errorDiv = page.locator('.error');
      await loginWith(page, testUser.username, 'a wrong password');
      await expect(errorDiv).toContainText(/wrong/i);
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(215, 34, 2)');
    });
  });
});

// 5.19
describe('When logged in', () => {
  beforeEach(async ({ page }) => {
    // ...
  });

  test('a new blog can be created', async ({ page }) => {
    // ...
  });
});
