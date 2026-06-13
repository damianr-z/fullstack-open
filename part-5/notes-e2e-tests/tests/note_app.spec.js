const { test, describe, expect, beforeEach } = require('@playwright/test');
const { loginWith, createNote } = require('./helper');

describe('Note app', () => {
  let testUser;

  beforeEach(async ({ page, request }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    const resetResponse = await request.post('/api/testing/reset');
    if (!resetResponse.ok()) {
      console.warn(
        'Could not reset database via /api/testing/reset. Continuing with isolated test user.',
      );
    }

    testUser = {
      name: 'Matti Luukkainen',
      username: `mluukkai-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      password: 'salainen',
    };

    const createUserResponse = await request.post('/api/users', {
      data: testUser,
    });
    expect(createUserResponse.ok()).toBeTruthy();

    await page.goto('/');
  });

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Click to log in');
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2025',
      ),
    ).toBeVisible();
  });

  test('user can log in', async ({ page }) => {
    await loginWith(page, testUser.username, testUser.password);
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
  });

  test('login fails with the wrong password', async ({ page }) => {
    await loginWith(page, testUser.username, 'wrong');
    const errorDiv = page.locator('.error');

    await expect(errorDiv).toContainText('wrong credentials');
    await expect(errorDiv).toHaveCSS('border-style', 'solid');
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
    await expect(page.getByText('Matti Luukainen logged in')).not.toBeVisible();
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password);
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by Playwright');
      await expect(
        page.getByText('a note created by Playwright'),
      ).toBeVisible();
    });

    describe('and several notes exist', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'first note');
        await createNote(page, 'second note');
        await createNote(page, 'third note');
      });

      test('one of those tests can be made non-important', async ({ page }) => {
        /*Looking fot the span's parent element to target the button inside it*/
        const otherNoteText = page.getByText('third note');
        const otherNoteElement = otherNoteText.locator('..');

        await otherNoteElement
          .getByRole('button', { name: 'make important' })
          .click();
        await expect(
          otherNoteElement.getByText('make not important'),
        ).toBeVisible();
      });

      test('importance can be changed', async ({ page }) => {
        const note = page.locator('.note').filter({ hasText: 'second note' });
        await note.getByRole('button', { name: 'make important' }).click();
        await expect(note.getByText('make not important')).toBeVisible();
      });
    });
  });
});
