const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, clickLikeBtn } = require('./helper');

// DONE: 5.17
describe('Blog app', () => {
  const TEST_USERS = [
    {
      name: 'Alexandre',
      username: 'xerox2',
      password: 'aventure',
    },
    {
      name: 'Daniel',
      username: 'testUser2',
      password: 'testPass2',
    },
  ];
  const [testUser1, testUser2] = TEST_USERS;

  beforeEach(async ({ page, request }) => {
    const assertOk = async (response, label) => {
      if (!response.ok()) {
        const body = await response.text();
        throw new Error(`${label} failed (${response.status()}): ${body}`);
      }
    };
    const resetResponse = await request.post('/api/testing/reset');
    await assertOk(resetResponse, 'Reset /api/testing/reset');

    for (const user of TEST_USERS) {
      const res = await request.post('/api/users', { data: user });
      await assertOk(res, `Seed user ${user.username}`);
    }

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(form.getByRole('button', { name: /login/i })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, testUser1.username, testUser1.password);
      await expect(page.locator('body')).toContainText(/logged-in/i);
    });
    // DONE: 5.18
    test('fails with wrong credentials', async ({ page }) => {
      const errorDiv = page.locator('.error');
      await loginWith(page, testUser1.username, 'a wrong password');
      await expect(errorDiv).toContainText(/wrong/i);
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(215, 34, 2)');
      await expect(page.locator('body')).not.toContainText(/logged-in/i);
    });
  });

  // DONE: 5.19
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUser1.username, testUser1.password);
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
    test('a blog can be deleted', async ({ page }) => {
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

  // DONE: 9.22
  describe('When logging a different user', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUser1.username, testUser1.password);
      await createBlog(page, 'Test Book', 'User 1', 'test url');
      await page
        .locator('body')
        .getByRole('button', { name: /^log\sout$/i })
        .click();
    });

    test("a logged-in user cannot delete another user's blog", async ({
      page,
    }) => {
      await loginWith(page, testUser2.username, testUser2.password);
      const targetBlog = page.locator('.blog', {
        hasText: 'Test Book by User 1',
      });
      await expect(targetBlog).toBeVisible();
      await targetBlog.getByRole('button', { name: /^more$/i }).click();
      await expect(
        targetBlog.getByRole('button', { name: /^Delete$/i }),
      ).toHaveCount(0);
    });
  });

  // DONE:  9.23 
  describe('When a user likes different blogs', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUser1.username, testUser1.password);
      await createBlog(page, 'Test Book 1', 'Martin Fowler', 'test url');
      await createBlog(page, 'Test Book 2', 'George Orwell', 'test url');
     await createBlog(page, 'Test Book 3', 'Stephen King', 'test url');
    });

    test('blogs are listed according to their number of likes', async ({
      page,
    }) => {
      const blogOne = page
        .locator('.blog')
        .filter({ hasText: 'Test Book 1 by Martin Fowler' });
      const blogTwo = page
        .locator('.blog')
        .filter({ hasText: 'Test Book 2 by George Orwell' });
      const blogThree = page.locator('.blog').filter({
        hasText: 'Test Book 3 by Stephen King',
      });

      await clickLikeBtn(blogOne, 3);
      await clickLikeBtn(blogTwo, 1);
      await clickLikeBtn(blogThree, 4);

      const blogItems = page.locator('.blogList .blog');
      const blogCount = await blogItems.count();
      const blogLikes = [];

      for (let i = 0; i < blogCount; i += 1) {
        const blog = blogItems.nth(i);
        const likeText = await blog
          .getByRole('button', { name: /^Like:\s\d+$/i })
          .textContent();
        const likeCount = Number(likeText?.match(/\d+/)?.[0] ?? 0);
        blogLikes.push(likeCount);
      }

      const sortedLikes = [...blogLikes].sort((a, b) => b - a);
      
      expect(blogCount).toBeGreaterThan(0);
      expect(blogLikes).toEqual(sortedLikes);

      // console.log('blog Likes are:', blogLikes);
      // console.log('like count array is:', blogLikes);
      // console.log('sorted likes array is:', sortedLikes);
    });
  });

  // Create a beforeEach block to create three different blogs under one user
  // Write the test block
  // Ssave each blog in a different variable
  // Click the thirdBlog 4 times, secondBlog 1 time and the firstBlog 3 times
  // store likes in an array
  // loop over array to verify that blog of lower indexes contain more like than those of higher indexes.
});
