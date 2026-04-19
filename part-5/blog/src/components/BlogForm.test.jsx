import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';
import Toogleable from './Toggleable';

vi.mock('../context/useAppContext', () => ({
  useAppContext: () => ({
    setBlogs: vi.fn(),
    user: { username: 'testuser' },
    showMessage: vi.fn(),
  }),
}));

// DONE: 5.16
describe('<Toggeable />', () => {
  let createBlog;
  let user;
  beforeEach(async () => {
    createBlog = vi.fn();
    user = userEvent.setup();
    render(
      <Toogleable>
        <BlogForm handleCreateBlog={createBlog} />
      </Toogleable>,
    );
    await user.click(screen.getByText('Enter new Book'));
  });

  test('The form calls the event handler it received as props with the right details when a new blog is created', async () => {
    const titleInput = screen.getByLabelText('title:');
    const authorInput = screen.getByLabelText('author:');
    const urlInput = screen.getByLabelText('url:');
    const submitBtn = screen.getByText('create');

    await user.type(titleInput, 'testing the title input...');
    await user.type(authorInput, 'testing the author input...');
    await user.type(urlInput, 'testing the url input...');
    await user.click(submitBtn);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog).toHaveBeenCalledWith({
      title: 'testing the title input...',
      author: 'testing the author input...',
      url: 'testing the url input...',
    });
  });
});

// Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.
// have the user interact with the fields
// console log the ruturned data

// test.only('The form calls the event handler it received as props with the right details when a new blog is created.', async () => {
//   const mockHandler = vi.fn();

//   render(<BlogForm handleCreateBlog={mockHandler} />);

//   const user = userEvent.setup();

//   const submitBtn = screen.getByText(/create/);
//   const input = screen.getByRole('textbox');
//   await user.click(submitBtn);
//   expect(mockHandler.mock.calls).toHaveLength(1);

//   screen.debug();
// });
