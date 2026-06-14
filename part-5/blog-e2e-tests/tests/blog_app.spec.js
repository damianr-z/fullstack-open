const { test, expect, beforeEach, describe } = require('@playwright/test');

// 5.17
describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.localStorage.clear();
    });

    const resetResponse = await request.post('/api/testing/reset');
    if (!resetResponse.ok()) {
      console.log(
        'Could not reset database via /api/testing/reset. Continue with isolated test user.',
      );
    }

    let testUser = {
      name: 'Alexandre',
      username: 'xerox2',
      password: 'aventure',
    };

    const createUserResponse = await request.post('/api/users', {
      data: testUser,
    });
    expect(createUserResponse.ok()).toBeTruthy();

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(form.getByRole('button', { name: /login/i })).toBeVisible();
  });

  // 5.18
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
    });

    test('fails with wrong credentials', async ({ page }) => {
      // ...
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
