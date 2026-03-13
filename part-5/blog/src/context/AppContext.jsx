import { createContext, useContext, useState, useEffect } from 'react';
import blogService from '../services/blogs';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null); // { text: string, type: 'success' | 'error' }
  const [user, setUser] = useState(null);

  // Fetch blogs on mount
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Check for logged-in user on mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      blogService.getAll().then(setBlogs);
    }
  }, []);


  const logout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    setBlogs([]);
    blogService.setToken(null);
  };

  const showMessage = (text, type = 'success', duration = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), duration);
  };

  const value = {
    blogs,
    setBlogs,
    user,
    setUser,
    message,
    showMessage,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      <main>{children}</main>
    </AppContext.Provider>
  );
};
