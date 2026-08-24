const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click();
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: /^login$/i }).click();
};

const createBlog = async (page, title, author, url) => {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedAuthor = author.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  await page.getByRole('link', { name: 'new blog' }).click();
  const blogForm = page.locator('form');
  if (!(await blogForm.isVisible())) {
    await page.getByRole('button', { name: 'enter new blog' }).click();
  }
  await page.getByLabel('title').fill(title);
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();

  // Wait until the created blog is visible in the list before proceeding.
  await page
    .locator('.blogList')
    .getByRole('link', {
      name: new RegExp(`^${escapedTitle} by ${escapedAuthor}$`, 'i'),
    })
    .first()
    .waitFor();
};

const clickLikeBtn = async (blog, times) => {
  await blog.getByRole('button', { name: /^more$/i }).click();
  const likeBtn = blog.getByRole('button', { name: /(Like|Likes):/i });
  for (let i = 0; i < times; i += 1) {
    await likeBtn.click();
    await blog
      .getByRole('button', {
        name: new RegExp(`^(Like|Likes):\\s${i + 1}$`, 'i'),
      })
      .waitFor();
  }
  return blog;
};

export { loginWith, createBlog, clickLikeBtn };
