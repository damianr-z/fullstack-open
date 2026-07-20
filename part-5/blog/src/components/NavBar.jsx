import { useAppContext } from '../context/useAppContext';
import { Link } from 'react-router-dom';

export default function NavBar({ user }) {
  const { logout } = useAppContext();

  const handleLogout = async (event) => {
    event.preventDefault();
    logout();
  };
  return (
    <div className={'userInfo'}>
        <Link to={'/'}>Blogs</Link>
      {user ? (
        <>
          <p>
            {user?.name} <em>logged-in</em>
          </p>
          <button onClick={handleLogout}>logout</button>
        </>
      ) : (
        <Link to={'/login'}>login</Link>
      )}
    </div>
  );
}
