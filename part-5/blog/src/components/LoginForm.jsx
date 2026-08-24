import { useState } from 'react';
import { useAppContext } from '../context/useAppContext';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import loginService from '../services/login';
import blogService from '../services/blogs';
import Message from './Message';

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
      // DONE: 5.29
      <Message />
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          maxWidth: 420,
          mx: 'auto',
          mt: 4,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, textAlign: 'center' }}
        >
          Log in to application
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Username"
            placeholder="username"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputBase-input::placeholder': {
                color: 'transparent',
                transition: 'color 0.2s ease',
              },
              '&:hover .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
              },
            }}
          />

          <TextField
            label="Password"
            placeholder="password"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiInputBase-input::placeholder': {
                color: 'transparent',
                transition: 'color 0.2s ease',
              },
              '&:hover .MuiInputBase-input::placeholder': {
                color: 'text.secondary',
              },
            }}
          />

          <Button type="submit" variant="contained" size="large">
            Login
          </Button>
        </Stack>
      </Box>
    </>
  );
}
