import { useAppContext } from '../context/useAppContext';
import { Link } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';

export default function NavBar({ user }) {
  const { logout } = useAppContext();

  const handleLogout = async (event) => {
    event.preventDefault();
    logout();
  };

  const hover = {
    '&:hover': {
      backgroundColor: 'rgba(250, 250, 255, 0.2)',
    },
  };

  return (
    <AppBar position="static" sx={{ marginBottom: '2rem' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button component={Link} to="/" color="inherit" sx={hover}>
          Blogs
        </Button>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" component="span">
              {user?.name} logged-in
            </Typography>
            <Button component={Link} to="/create" color="inherit" sx={hover}>
              new blog
            </Button>
            <Button color="inherit" onClick={handleLogout} sx={hover}>
              logout
            </Button>
          </Box>
        ) : (
          <Button component={Link} to="/login" color="inherit" sx={hover}>
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
