import { useState } from 'react';
import { useAppContext } from '../context/useAppContext';
import loginService from '../services/login';
import blogService from '../services/blogs';
import Message from './Message';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const { setUser, showMessage } = useAppContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      setUser(user);
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      blogService.setToken(user.token);
      clearForm();
      console.log('logging in with', username, password);
      navigate('/');
    } catch (exception) {
      showMessage('wrong credentials', 'error');
      clearForm();
    }
  };

  function clearForm() {
    setUsername('');
    setPassword('');
  }

  return (
    <>
      <Message />
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
        <button type="submit">login</button>
      </form>
    </>
  );
}
