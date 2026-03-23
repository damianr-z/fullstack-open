import { useAppContext } from '../context/AppContext';
import NewBlog from './NewBlog';
import Blog from './Blog';
import Message from './Message';

export default function UserBlogs() {
  const { user, blogs, setBlogs, logout, handleLikeOf } = useAppContext();

  const handleLogout = async (event) => {
    event.preventDefault();
    logout();
  };

  return (
    <>
      <Message />
      <div className={'userInfo'}>
        <p>
          {user.name} <em>logged-in</em>
        </p>
        <button onClick={handleLogout}>log out</button>
      </div>
      <h2>Blogs List</h2>
      <div className="blogContainer">
        <div className="blogListPanel">
          <ul className="blogList">
            {blogs
              .filter((blog) => blog.user?.username === user.username)
              //✅ 5.10 completed  
              .toSorted((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  handleLike={() => handleLikeOf(blog.id)}
                />
              ))}
          </ul>
        </div>
        <NewBlog />
      </div>
    </>
  );
}
