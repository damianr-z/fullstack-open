import { useAppContext } from '../context/useAppContext';
import { Link } from 'react-router-dom';
import NewBlog from './NewBlog';

export default function NavBar({ user }) {
  const { logout } = useAppContext();

  const handleLogout = async (event) => {
    event.preventDefault();
    logout();
  };
  return (
    <nav className={'userInfo'}>
      <Link to={'/'}>Blogs</Link>
      {user ? (
        <>
          <p>
            {user?.name} <em>logged-in</em>
          </p>
          <Link to={'/create'}>new blog</Link>
          <button onClick={handleLogout}>logout</button>
        </>
      ) : (
        <Link to={'/login'}>login</Link>
      )}
    </nav>
  );
}
