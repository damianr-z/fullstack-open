const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Enter new Book' }).click();
  await page.getByLabel('title').fill(title);
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page
    .locator('.blog')
    .filter({ hasText: `${title} by ${author}` })
    .first()
    .waitFor();
};

const clickLikeBtn = async (blog, times) => {
  await blog.getByRole('button', { name: /^more$/i }).click();
  const likeBtn = blog.getByRole('button', { name: /Like:/i });
  for (let i = 0; i < times; i += 1) {
    await likeBtn.click();
    await blog
      .getByRole('button', { name: new RegExp(`^Like:\\s${i + 1}$`, 'i') })
      .waitFor();
  }
  return blog;
};

export { loginWith, createBlog, clickLikeBtn };
