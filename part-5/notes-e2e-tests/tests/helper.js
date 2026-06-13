const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'Click to log in' }).click();
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: /^Login$/i }).click();
};

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click();
  await page.getByRole('textbox').fill(content);
  await page.getByRole('button', { name: 'save' }).click();
  await page.getByText(content).waitFor();
};

export { loginWith, createNote };
