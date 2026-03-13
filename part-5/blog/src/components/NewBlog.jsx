import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import blogService from '../services/blogs';

const NewBlog = () => {
  const { blogs, setBlogs, user, showMessage } = useAppContext();
  const [newBlog, setNewBlog] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const title = e.target.title.value.trim();
    const author = e.target.author.value.trim();
    const url = e.target.url.value.trim();

    // Debug logging
    console.log('Form values:', { title, author, url });

    // Client-side validation
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

    const blogObject = {
      url,
      title,
      author,
      user: user,
      likes: 0,
    };

    console.log('Sending new blog', blogObject);

    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        showMessage(
          `a new blog <i>${returnedBlog.title}</i> by <i>${returnedBlog.author}</i> added`,
          'success',
        );
        setNewBlog('');
        // Clear the form
        e.target.reset();
      })
      .catch((error) => {
        console.error('Error creating blog', error);
        console.error('Error response:', error.response);
        console.error('Error message:', error.message);

        // Handle server-side errors
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
      });
  };

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="title">title:</label>
        <input type="text" id="title" name="title" required />
        <label htmlFor="author">author:</label>
        <input type="text" id="author" name="author" required />
        <label htmlFor="url">url:</label>
        <input type="text" id="url" name="url" required />
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default NewBlog;
