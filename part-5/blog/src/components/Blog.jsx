import { useState } from 'react';

function Blog({ blog, handleLike }) {
  const [collapsed, setCollapsed] = useState(true);

  const handleShowDetails = (e) => {
    e.preventDefault();
    setCollapsed((prev) => !prev);
  };

  return (
    <li className="blog">
      <span>
        <h4>{blog.title}</h4>
        {!collapsed && (
          <ul>
            <li>Author: {blog.author}</li>
            <li>
              <li>Website: {blog.url}</li>
              Likes: {blog.likes}
              <button onClick={handleLike}>like</button>
            </li>
          </ul>
        )}
      </span>
      <button onClick={handleShowDetails}>{collapsed ? 'more' : 'hide'}</button>
    </li>
  );
}

export default Blog;
