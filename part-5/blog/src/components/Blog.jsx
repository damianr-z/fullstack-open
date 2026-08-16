import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';

function Blog() {
  const [collapsed, setCollapsed] = useState(true);
  const { blogs, user, handleLikeOf, handleDeleteOf } = useAppContext();

  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return <div className="blog">Blog not found.</div>;
  }

  const handleLike = () => handleLikeOf(blog.id);
  const handleDelete = () =>
    handleDeleteOf({ id: blog.id, username: user?.username });

  const handleShowDetails = (e) => {
    e.preventDefault();
    setCollapsed((prev) => !prev);
  };

  const isUserLogged = Boolean(user?.username);
  const userOwnsBlog = user?.username === blog.user?.username;

  return (
    <div className="blog">
      <span>
        <h4>
          {blog.title} by {blog.author}
        </h4>
        {!collapsed && (
          <ul>
            <li>Website: {blog.url}</li>
            <li>
              {/* DONE: 5.25 */}
              {isUserLogged ? (
                <button onClick={handleLike}>
                  {blog.likes > 1 || blog.likes === 0
                    ? `Likes: ${blog.likes}`
                    : `Like: ${blog.likes}`}
                </button>
              ) : (
                <p>
                  {blog.likes > 1 || blog.likes === 0
                    ? `Likes: ${blog.likes}`
                    : `Like: ${blog.likes}`}
                </p>
              )}
            </li>

            {isUserLogged && userOwnsBlog && (
              <li>
                <button onClick={handleDelete}>Delete</button>
              </li>
            )}
          </ul>
        )}
      </span>
      <button onClick={handleShowDetails}>{collapsed ? 'more' : 'hide'}</button>
    </div>
  );
}

export default Blog;
