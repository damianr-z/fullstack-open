import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const [authReady, setAuthReady] = useState(false);
  const messageTimerRef = useRef(null);

  // Restore auth state once on mount
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }

    setAuthReady(true);
  }, []);

  // Fetch blogs after auth restoration has completed
  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!user) {
      return;
    }

    let isActive = true;

    blogService
      .getAll()
      .then((fetchedBlogs) => {
        if (isActive) {
          setBlogs(fetchedBlogs);
        }
      })
      .catch((e) => {
        if (isActive) {
          console.error('Failed to fetch blogs:', e);
        }
      });

    return () => {
      isActive = false;
    };
  }, [authReady, user]);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) {
        clearTimeout(messageTimerRef.current);
      }
    };
  }, []);

  const blogFormRef = useRef();

  const logout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    setBlogs([]);
    blogService.setToken(null);
  };

  const showMessage = (text, type = 'success', duration = 5000) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }

    setMessage({ text, type });
    messageTimerRef.current = setTimeout(() => {
      setMessage(null);
      messageTimerRef.current = null;
    }, duration);
  };

  //Handling Like update

  const handleLikeOf = (id) => {
    if (!id) return;
    const target = blogs.find((n) => n.id === id);
    if (!target) {
      showMessage('Blog not found', 'error');
      return;
    }

    const updatedBlog = { ...target, likes: target.likes + 1 };
    blogService
      .update(id, updatedBlog)
      .then((returnedBlog) => {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog.id !== id ? blog : returnedBlog)),
        );
      })
      .catch(() => {
        showMessage(`Blog '${id}' was already removed from server`, 'error');
        setBlogs((prevBlogs) => prevBlogs.filter((n) => n.id !== id));
      });
  };

  //   const toggleImportanceOf = (id) => {
  //   const note = notes.find((n) => n.id === id);
  //   const changedNote = { ...note, important: !note.important };

  //   noteService
  //     .update(id, changedNote)
  //     .then((returnedNote) => {
  //       setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
  //     })
  //     .catch(() => {
  //       setErrorMessage(
  //         `Note '${note.content}' was already removed from server`,
  //       );
  //       setTimeout(() => {
  //         setErrorMessage(null);
  //       }, 5000);
  //       setNotes(notes.filter((n) => n.id !== id));
  //     });
  // };

  const value = {
    blogs,
    setBlogs,
    user,
    setUser,
    message,
    showMessage,
    logout,
    handleLikeOf,
  };

  return (
    <AppContext.Provider value={value}>
      <main>{children}</main>
    </AppContext.Provider>
  );
};
