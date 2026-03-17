import blogService from '../services/blogs';
import { useAppContext } from '../context/AppContext';

export default function BlogForm({ blogFormRef }) {
  const { setBlogs, user, showMessage } = useAppContext();
  const addBlog = async (e) => {
    e.preventDefault();
    const form = e.target;

    const title = form.title.value.trim();
    const author = form.author.value.trim();
    const url = form.url.value.trim();

    if (!title) {
      showMessage('Please add a title', 'error', 3000);
      return;
    }
    if (!author) {
      showMessage('Please add an author', 'error', 3000);
      return;
    }
    if (!url) {
      showMessage('Please add an URL', 'error', 3000);
      return;
    }

    try {
      const returnedBlog = await blogService.create({
        url,
        title,
        author,
        user,
        likes: 0,
      });

      const normalizedBlog = {
        ...returnedBlog,
        user:
          typeof returnedBlog.user === 'object' && returnedBlog.user !== null
            ? returnedBlog.user
            : { username: user.username, name: user.name, id: user.id },
      };

      setBlogs((prevBlogs) => prevBlogs.concat(normalizedBlog));
      showMessage(
        `a new blog <i>${returnedBlog.title}</i> by <i>${returnedBlog.author}</i> added`,
        'success',
      );
      form.reset();
      blogFormRef.current?.toggleVisibility();
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMsg =
          error.response?.data?.error ||
          'Invalid blog data. Please check all fields.';
        showMessage(errorMsg, 'error');
      } else if (error.response?.status === 401) {
        showMessage('Unauthorized. Please log in again.', 'error');
      } else {
        showMessage('Failed to create blog. Please try again.', 'error');
      }
    }
  };

  return (
    <form onSubmit={addBlog} noValidate>
      <label htmlFor="title">title:</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="author">author:</label>
      <input type="text" id="author" name="author" required />
      <label htmlFor="url">url:</label>
      <input type="text" id="url" name="url" required />
      <button type="submit">create</button>
    </form>
  );
}
