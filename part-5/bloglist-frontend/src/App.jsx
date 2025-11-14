import { useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import NewBlog from './components/NewBlog';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(null); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser');
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  
  useEffect(() => {
    blogService.getAll().then(blogs => {
      console.log('blogsAtStart', blogs.length);
    });
  }, []);
  
  function clearForm() {
    setUsername('');
    setPassword('');
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedUser', JSON.stringify(user));

      blogService.setToken(user.token);
      setUser(user);
    } catch (exception) {
      setErrorMessage('wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
        clearForm()
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const loginForm = () => (
    <>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>login</button>
      </form>
    </>
  );

  const userBlogs = () => (
    <>
     {successMessage && <div className="success">{successMessage}</div>}
      <h2>blogs</h2>
      <div className={'userInfo'}>
        <p>
          {user.name} <em>logged-in</em>
        </p>
        <button onClick={handleLogout}>log out</button>
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
      <NewBlog
        blogService={blogService}
        setBlogs={setBlogs}
        blogs={blogs}
        message={setSuccessMessage}
        user={user}
      />
    </>
  );

  return <div className="app">{!user ? loginForm() : userBlogs()}</div>;
};

export default App;
