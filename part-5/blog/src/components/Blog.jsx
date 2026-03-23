import { useState } from 'react';

function Blog({ blog, handleLike, handleDelete, username }) {
  const [collapsed, setCollapsed] = useState(true);

  const handleShowDetails = (e) => {
    e.preventDefault();
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="blog">
      <span>
        <h4>{blog.title}</h4>
        {!collapsed && (
          <ul>
            <li>Author: {blog.author}</li>
            <li>Website: {blog.url}</li>
            <li>
              <button onClick={handleLike}>Like: {blog.likes}</button>
            </li>
            <li>
              {blog.user?.username === username ? (<button onClick={handleDelete}>Delete</button>) : ''}
            </li>
          </ul>
        )}
      </span>
      <button onClick={handleShowDetails}>{collapsed ? 'more' : 'hide'}</button>
    </div>
  );
}

export default Blog;
