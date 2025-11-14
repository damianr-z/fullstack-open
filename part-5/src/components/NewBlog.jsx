import React, { useState } from 'react';

const NewBlog = ({
  blogService,
  blogs,
  setBlogs,
  user,
  successMessage,
  errorMessage,
}) => {
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
      errorMessage('Please add a title');
      setTimeout(() => errorMessage(null), 3000);
      return;
    }
    if (!author) {
      errorMessage('Please add an author');
      setTimeout(() => errorMessage(null), 3000);
      return;
    }
    if (!url) {
      errorMessage('Please add an URL');
      setTimeout(() => errorMessage(null), 3000);
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
        successMessage(
          `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
        );
        setTimeout(() => {
          successMessage(null);
        }, 5000);
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
          errorMessage(errorMsg);
        } else if (error.response?.status === 401) {
          errorMessage('Unauthorized. Please log in again.');
        } else {
          errorMessage('Failed to create blog. Please try again.');
        }
        setTimeout(() => errorMessage(null), 5000);
      });
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">title:</label>
        <input type="text" id="title" name="title" required />
        <label htmlFor="author">author:</label>
        <input type="text" id="author" name="author" required />
        <label htmlFor="url">url:</label>
        <input type="text" id="url" name="url" required />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default NewBlog;
