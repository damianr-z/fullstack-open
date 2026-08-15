import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import Blog from './Blog';

const { mockUseAppContext } = vi.hoisted(() => ({
  mockUseAppContext: vi.fn(),
}));

vi.mock('../context/useAppContext', () => ({
  useAppContext: mockUseAppContext,
}));

/// DONE: 5.13
test('Loads the title and author while keeping the url and likes hidden', () => {
  const blog = {
    id: 'blog-0',
    title: 'Some catchy title',
    author: 'Some author',
    url: 'example.com',
    likes: 1,
    user: { username: 'ownerUser' },
  };

  mockUseAppContext.mockReturnValue({
    blogs: [blog],
    user: null,
    handleLikeOf: vi.fn(),
    handleDeleteOf: vi.fn(),
  });

  const { container } = render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </MemoryRouter>,
  );
  const titleAndAuthor = screen.getByText(`${blog.title} by ${blog.author}`);
  expect(titleAndAuthor).toBeDefined();
  const list = container.querySelector('ul');
  expect(list).not.toBeInTheDocument();
  // screen.debug();
});

// DONE: 5.14
test("The blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
  const blog = {
    id: 'blog-00',
    title: 'Test Title',
    author: 'Test Author',
    url: 'example.com',
    likes: 5,
    user: { username: 'ownerUser' },
  };

  // Not need to use mockHandler since the handleShowDetails is a local function, not a prop
  //const mockHandler = vi.fn();

  mockUseAppContext.mockReturnValue({
    blogs: [blog],
    user: null,
    handleLikeOf: vi.fn(),
    handleDeleteOf: vi.fn(),
  });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  const button = screen.getByText('more');
  await user.click(button);

  expect(screen.getByText(/Website:.*/)).toBeInTheDocument();
  expect(screen.getByText(/Likes: 5/)).toBeInTheDocument();
  // screen.debug();
});

// DONE: 5.15
test('If the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
  const blog = {
    id: 'blog-1',
    title: 'Test Title',
    author: 'Test Author',
    url: 'example.com',
    likes: 0,
    user: { username: 'testuser' },
  };

  const likeHandler = vi.fn();
  mockUseAppContext.mockReturnValue({
    blogs: [blog],
    user: { username: 'testuser' },
    handleLikeOf: likeHandler,
    handleDeleteOf: vi.fn(),
  });

  render(
    <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  const moreButton = screen.getByText('more');
  await user.click(moreButton);
  const likeButton = screen.getByText(/Likes:|Like:/);
  await user.click(likeButton);
  await user.click(likeButton);
  expect(likeHandler.mock.calls).toHaveLength(2);

  // screen.debug();
});

// DONE: 5.27
test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', async () => {
  const mockBlog = {
    id: 'blog-123',
    title: 'Some Title',
    author: 'Some Author',
    url: 'example.com',
    likes: 5,
    user: { username: 'ownerUser' },
  };

  mockUseAppContext.mockReturnValue({
    blogs: [mockBlog],
    user: null,
    handleLikeOf: vi.fn(),
    handleDeleteOf: vi.fn(),
  });

  render(
    <MemoryRouter initialEntries={[`/blogs/${mockBlog.id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </MemoryRouter>,
  );

  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'more' }));

  expect(screen.getByText('Website: example.com')).toBeInTheDocument();
  expect(screen.getByText('Likes: 5')).toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /Likes|Like/i }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Delete' }),
  ).not.toBeInTheDocument();
});

test('Authenticated users who are not the blog\’s creator are shown only the like button', async () => {});
test('The blog\’s creator is also shown the delete button', async () => {});
