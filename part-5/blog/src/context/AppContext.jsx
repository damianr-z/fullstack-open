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

  //////////////////////✅ Exercise 5.8 -- Functionality for like button.
  // Like update flow:
  // 1) Validate the clicked id.
  // 2) Find the blog in local state.
  // 3) Build a new object with likes + 1 (no mutation).
  // 4) Send update request to backend.
  // 5) On success, replace only the matching blog in state.
  // 6) On 404, remove missing blog from state.
  // 7) On other errors, keep state unchanged and show a message.
  const handleLikeOf = (id) => {
    // Guard clause: if click did not provide an id, stop early.
    if (!id) return;

    // Find the target blog from current state.
    const target = blogs.find((n) => n.id === id);
    if (!target) {
      showMessage(
        'The targeted blog has not been found or it is deleted ',
        'error',
      );
      return;
    }

    // Create payload immutably so React state is not mutated directly.
    const likedBlog = { ...target, likes: target.likes + 1 };

    blogService
      .update(id, likedBlog)
      // Success path: update only the clicked blog, keep others unchanged.
      .then((returnedBlog) => {
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) => (blog.id !== id ? blog : returnedBlog)),
        );
      })
      // Error path: branch by HTTP status.
      .catch((error) => {
        // 404 means blog no longer exists on server -> remove locally too.
        if (error.response?.status === 404) {
          showMessage(
            `Blog with id ${id} was already removed from server`,
            'error',
          );
          setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        } else {
          // Other errors (network/500/etc): keep state and notify user.
          showMessage('Failed to update likes. Try again.');
        }
      });
  };

  //// Delete logic
  //✅ 5.11 completed
  const handleDeleteOf = ({ id, username }) => {
    if (!id) return;

    const result = window.confirm('Are you sure want to delete this blog?');

    if (!result) {
      (console.log('operation cancelled'),
        blogService.getAll().then((fetchedBlogs) => console.log(fetchedBlogs)));
    }

    if (result) {
      const target = blogs.find((n) => n.id === id);
      const notRightUser = blogs.find((n) => n.user?.username === username);

      if (!target) {
        showMessage('The blog could not be found', 'error');
        return;
      }

      if (!notRightUser) {
        showMessage(
          'Only blogs that belong to the logged-in user can be deleted',
          'error',
        );
        return;
      }

      blogService
        .remove(id)
        .then(() => {
          showMessage(`Deleting blog ${target.title} by ${target.author}`);
          // Filter is used for removal while Map is used for transformation, hence the logic varies when compared to the update logic handler.
          setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            showMessage(
              `Blog with id ${id} was already removed from server`,
              'error',
            );
            setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
          } else {
            showMessage('Failed to delete blog, try again');
          }
        });

      blogService.getAll().then((fetchedBlogs) => console.log(fetchedBlogs));
    }
  };

  const value = {
    blogs,
    setBlogs,
    user,
    setUser,
    message,
    showMessage,
    logout,
    handleLikeOf,
    handleDeleteOf,
  };

  return (
    <AppContext.Provider value={value}>
      <main>{children}</main>
    </AppContext.Provider>
  );
};
