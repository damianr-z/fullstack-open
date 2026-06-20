const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');
const blog = require('../../../part-4/bloglist-bend/models/blog');

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

  // DONE: 5.19
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password);
      await expect(page.locator('body')).toContainText(/logged-in/i);
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Book', 'Playwright', 'test url');
      await expect(page.locator('body')).toContainText(
        /Test Book by Playwright/i,
      );
    });
    // DONE: 9.20
    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Test Book', 'Playwright', 'test url');
      await page
        .locator('.blog')
        .getByRole('button', { name: /^more$/i })
        .click();
      await page.locator('.blog button').first().click();
      await expect(page.locator('.blog button').first()).toContainText(
        /^Like:\s1$/i,
      );
    });

    // DONE: 9.21
    test.only('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'Test Book', 'Playwright', 'test url');
      const targetBlog = page.locator('.blog', {
        hasText: 'Test Book by Playwright',
      });

      await targetBlog.getByRole('button', { name: /^more$/i }).click();

      await Promise.all([
        page.waitForEvent('dialog').then(async (dialog) => {
          expect(dialog.type()).toBe('confirm');
          expect(dialog.message()).toMatch(
            /Are you sure want to delete this blog?/i,
          );
          await dialog.accept();
        }),
        targetBlog.getByRole('button', { name: /^Delete$/i }).click(),
      ]);

      await expect(page.locator('body')).toContainText(
        /Deleting blog Test Book by Playwright/i,
      );

      await expect(targetBlog).not.toBeVisible();
      await expect(targetBlog).toHaveCount(0);
    });
  });
});
