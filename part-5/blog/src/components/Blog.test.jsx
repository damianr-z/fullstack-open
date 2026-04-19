import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

/// DONE: 5.13 
test('Loads the title and author while keeping the url and likes hidden', () => {
  const blog = {
    title: 'Some catchy title',
    author: 'Some author',
  };

  const { container } = render(<Blog blog={blog} />);
  const titleAndAuthor = screen.getByText(`${blog.title} by ${blog.author}`);
  expect(titleAndAuthor).toBeDefined();
  const list = container.querySelector('ul');
  expect(list).not.toBeInTheDocument();
  // screen.debug();
});

// DONE: 5.14
test("The blog's URL and number of likes are shown when the button controlling the shown details has been clicked", async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'example.com',
    likes: 5,
  };

  // Not need to use mockHandler since the handleShowDetails is a local function, not a prop
  //const mockHandler = vi.fn();

  render(<Blog blog={blog} />);

  const user = userEvent.setup();
  const button = screen.getByText('more');
  await user.click(button);

  expect(screen.getByText(/Website:.*/)).toBeInTheDocument();
  expect(screen.getByText(/Like: 5/)).toBeInTheDocument();
  // screen.debug();
});

// DONE: 5.15
test('If the like button is clicked twice, the event handler the component received as props is called twice.', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'example.com',
    likes: 0,
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} handleLike={mockHandler} />);

  const user = userEvent.setup();
  const moreButton = screen.getByText('more');
  await user.click(moreButton);
  const likeButton = screen.getByText(/Like: /);
  await user.click(likeButton);
  await user.click(likeButton);
  expect(mockHandler.mock.calls).toHaveLength(2);

  // screen.debug();
});
