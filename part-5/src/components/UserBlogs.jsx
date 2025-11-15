import { useAppContext } from '../context/AppContext';
import NewBlog from './NewBlog';
import Blog from './Blog';
import Message from './Message';

export default function UserBlogs() {
  const { user, blogs, logout } = useAppContext();

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
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
      <NewBlog />
    </>
  );
}
