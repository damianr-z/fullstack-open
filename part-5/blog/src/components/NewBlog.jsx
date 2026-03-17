import React, { useRef } from 'react';
import Toogleable from './Toggleable';
import BlogForm from './BlogForm';

const NewBlog = () => {
  const blogFormRef = useRef();

  return (
    <div className='newBlog'>
      <Toogleable ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Toogleable>
    </div>
  );
};

export default NewBlog;
