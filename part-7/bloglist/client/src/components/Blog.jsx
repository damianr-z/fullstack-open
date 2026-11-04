import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs';
import { useAppContext } from '../context/useAppContext';
import { Box, Button, List, ListItem, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LikeIcon from '@mui/icons-material/ThumbUp';
import ErrorMessage from './ErrorMessage';

function Blog() {
  // for testing ErrorBoundary
  // throw new Error('test');
  const [collapsed, setCollapsed] = useState(true);
  const { blogs, user, handleLikeOf, handleDeleteOf } = useAppContext();

  const { id } = useParams();
  const [fetchedBlog, setFetchedBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;
    setFetchedBlog(null);
    setError(null);

    blogService
      .getOne(id)
      .then((data) => isActive && setFetchedBlog(data))
      .catch((e) => isActive && setError(e));

    return () => {
      isActive = false;
    };
  }, [id]);

  // The list in context stays current after likes, so prefer it over the fetched copy
  const blog = blogs.find((b) => b.id === id) ?? fetchedBlog;

  if (!blog) {
    if (!error) return null;
    return (
      <ErrorMessage
        message="The blog could not be found"
        status={error.response?.status}
        retry={false}
      />
    );
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

  // DONE: 5.31

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 4,
        p: 2,
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h3" component="h2">
            {blog.title}
          </Typography>
          <Typography
            variant="h4"
            component="span"
            sx={{ display: 'block', color: 'text.secondary' }}
          >
            by {blog.author}
          </Typography>
        </Box>

        <Button
          color="secondary"
          onClick={handleShowDetails}
          sx={{
            alignSelf: 'flex-start',
            '&:hover': {
              borderBottom: '2px solid',
              borderColor: 'secondary.main',
              borderRadius: 0,
            },
          }}
        >
          {collapsed ? 'more' : 'hide'}
        </Button>
      </Box>

      {!collapsed && (
        <List>
          <ListItem sx={{ py: 0.5, px: 0 }}>
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: 0 }}
            >
              {blog.url}
            </a>
          </ListItem>

          <ListItem sx={{ py: 1.5, px: 0 }}>
            <Typography
              variant="body4"
              component="p"
              sx={{ fontSize: '1.15rem' }}
            >
              Added by {blog.user?.name ?? 'Unknown'}
            </Typography>
          </ListItem>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            {/* DONE: 5.25 */}

            {isUserLogged ? (
              <Button
                variant="outlined"
                onClick={handleLike}
                startIcon={<LikeIcon />}
              >
                {blog.likes > 1 || blog.likes === 0
                  ? `Likes: ${blog.likes}`
                  : `Like: ${blog.likes}`}
              </Button>
            ) : (
              <Typography variant="body1" component="span">
                {blog.likes > 1 || blog.likes === 0
                  ? `Likes: ${blog.likes}`
                  : `Like: ${blog.likes}`}
              </Typography>
            )}

            {isUserLogged && userOwnsBlog && (
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                variant="outlined"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </Box>
        </List>
      )}
    </Box>
  );
}

export default Blog;
