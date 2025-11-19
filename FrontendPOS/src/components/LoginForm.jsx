import { Alert, Box, Button, Container, TextField } from '@mui/material';
import { useState } from 'react';
import useUserActions from '../hooks/user.actions';

const LoginForm = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const { login } = useUserActions();
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      username: form.username,
      password: form.password,
    };

    login(data).catch((err) => {
      if (err.response) {
        setError(err.response.data.detail);
      } else {
        setError('Network error');
      }
    });
  };

  return (
    <Container maxWidth="sm">
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={form.username}
          onChange={(e) => {
            setForm({ ...form, username: e.target.value });
            if (error) setError(null);
          }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
            if (error) setError(null);
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          size="large"
        >
          Sign In
        </Button>
      </Box>
    </Container>
  );
};

export default LoginForm;
