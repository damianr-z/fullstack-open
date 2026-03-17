import React, { useRef } from 'react';
import Toogleable from './Toggleable';
import BlogForm from './BlogForm';

const NewBlog = () => {
  const blogFormRef = useRef();

  return (
    <>
      <Toogleable ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Toogleable>
    </>
  );
};

export default NewBlog;
