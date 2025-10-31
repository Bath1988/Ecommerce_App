import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

export default function EmployerLogin({ onLogin }) {
  const [employerId, setEmployerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // TODO: Replace with real API call
    if (employerId === 'admin' && password === 'password') {
      onLogin({ employerId });
    } else {
      setError('Invalid employer ID or password');
    }
  };

  return (
    <Paper sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h6" gutterBottom>Employer Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Employer ID"
          value={employerId}
          onChange={e => setEmployerId(e.target.value)}
          fullWidth
          margin="normal"
          required
          helperText="Test Employer ID: admin"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          helperText="Test Password: password"
        />
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </Paper>
  );
}
