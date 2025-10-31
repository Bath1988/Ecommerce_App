import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';


export default function CategoryForm({ onAdd }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to add category');
      } else {
        const newCategory = await res.json();
        setName('');
        if (onAdd) onAdd(newCategory);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>Add Product Category</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
          error={!!error}
          helperText={error}
          disabled={loading}
        />
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </Button>
      </form>
    </Paper>
  );
}
