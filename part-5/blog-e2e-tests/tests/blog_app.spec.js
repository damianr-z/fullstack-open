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
    await page.getByRole('link', { name: 'login' }).click();
    const form = page.locator('form');
    await expect(form).toBeVisible();
    await expect(form.getByRole('button', { name: /login/i })).toBeVisible();
  });

  describe('Login', () => {
    test('Login succeeds with the correct username/password combination', async ({
      page,
    }) => {
      await loginWith(page, testUser1.username, testUser1.password);
      await expect(page.locator('body')).toContainText(/logged-in/i);
    });
    // DONE: 5.18
    test('Login fails if the username/password is incorrect', async ({
      page,
    }) => {
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
      await expect(page.locator('.success')).toContainText(
        /a new blog Test Book by Playwright added/i,
      );
    });
    // DONE: 9.20
    test('A logged-in user can like blogs', async ({ page }) => {
      await createBlog(page, 'Test Book', 'Playwright', 'test url');
      await page
        .locator('.blogList')
        .getByRole('link', { name: /^Test Book by Playwright$/i })
        .click();
      const targetBlog = page
        .locator('.blog')
        .filter({ hasText: 'Test Book by Playwright' })
        .first();
      await targetBlog.getByRole('button', { name: /^more$/i }).click();
      const likeBtn = targetBlog.getByRole('button', {
        name: /^(Likes|Like):\s\d+$/i,
      });
      await likeBtn.click();
      await expect(likeBtn).toContainText(/^Like:\s1$/i);
    });

    // DONE: 9.21
    test('A logged-in user can delete a blog', async ({ page }) => {
      await createBlog(page, 'Test Book', 'Playwright', 'test url');
      const listedBlog = page
        .locator('.blogList')
        .getByRole('link', { name: /^Test Book by Playwright$/i });
      await listedBlog.click();
      const targetBlog = page
        .locator('.blog')
        .filter({ hasText: 'Test Book by Playwright' })
        .first();
      await targetBlog.getByRole('button', { name: /^more$/i }).click();
      const deleteBtn = targetBlog.getByRole('button', {
        name: /^Delete$/i,
      });

      await Promise.all([
        page.waitForEvent('dialog').then(async (dialog) => {
          expect(dialog.type()).toBe('confirm');
          expect(dialog.message()).toMatch(
            /Are you sure want to delete this blog?/i,
          );
          await dialog.accept();
        }),
        deleteBtn.click(),
      ]);

      await expect(page.locator('.success')).toContainText(
        /Deleted blog Test Book by Playwright/i,
      );

      await expect(listedBlog).not.toBeVisible();
      await expect(listedBlog).toHaveCount(0);
    });
  });

  // DONE: 9.22
  describe('When logging a different user', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUser1.username, testUser1.password);
      await createBlog(page, 'Test Book', 'User 1', 'test url');
      await page
        .locator('body')
        .getByRole('button', { name: /^logout$/i })
        .click();
    });

    test("a logged-in user cannot delete another user's blog", async ({
      page,
    }) => {
      await loginWith(page, testUser2.username, testUser2.password);
      const listedBlog = page
        .locator('.blogList')
        .getByRole('link', { name: /^Test Book by User 1$/i });
      await listedBlog.click();
      const targetBlog = page
        .locator('.blog')
        .filter({ hasText: 'Test Book by User 1' })
        .first();
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
      const likeBlog = async (title, author, likesCount) => {
        await page
          .locator('.blogList')
          .getByRole('link', {
            name: new RegExp(`^${title} by ${author}$`, 'i'),
          })
          .click();

        const targetBlog = page
          .locator('.blog')
          .filter({ hasText: `${title} by ${author}` })
          .first();
        await clickLikeBtn(targetBlog, likesCount);
        await page.getByRole('link', { name: /^Blogs$/i }).click();
      };

      await likeBlog('Test Book 1', 'Martin Fowler', 3);
      await likeBlog('Test Book 2', 'George Orwell', 1);
      await likeBlog('Test Book 3', 'Stephen King', 4);

      const blogLinks = page.locator('.blogList li a');
      await expect(blogLinks).toHaveCount(3);
      await expect(blogLinks.nth(0)).toContainText(
        /Test Book 3 by Stephen King/i,
      );
      await expect(blogLinks.nth(1)).toContainText(
        /Test Book 1 by Martin Fowler/i,
      );
      await expect(blogLinks.nth(2)).toContainText(
        /Test Book 2 by George Orwell/i,
      );

      // console.log('blog Likes are:', blogLikes);
      // console.log('like count array is:', blogLikes);
      // console.log('sorted likes array is:', sortedLikes);
    });
  });
});
