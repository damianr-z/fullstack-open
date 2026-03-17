import { useState } from 'react';

function Blog({ blog }) {
  const [collapsed, setCollapsed] = useState(true);

  const handleShowDetails = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <li className="blog">
      <span>
        <h4>{blog.title}</h4>
        {!collapsed && (
          <ul>
            <li>Author: {blog.author}</li>
            <li>Website: {blog.url}</li>
            <li>Likes: {blog.likes}</li>
          </ul>
        )}
      </span>
      <button onClick={handleShowDetails}>{collapsed ? 'more' : 'hide'}</button>
    </li>
  );
}

export default Blog;
