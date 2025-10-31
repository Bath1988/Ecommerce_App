import React, { useState } from 'react';
import { Box, TextField, Button, MenuItem, Typography, Paper } from '@mui/material';


export default function ProductForm({ categories, onSubmit, initialProduct }) {
  const [name, setName] = useState(initialProduct?.name || '');
  const [category, setCategory] = useState(initialProduct?.category || (categories[0]?.name || ''));
  const [price, setPrice] = useState(initialProduct?.price || '');
  const [stock, setStock] = useState(initialProduct?.stock || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !category || !price || !stock) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      // Find categoryId from name
      const catObj = categories.find(c => c.name === category);
      if (!catObj) {
        setError('Invalid category');
        setLoading(false);
        return;
      }
      const productData = {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        categoryId: catObj.id
      };
      if (initialProduct?.id) {
        // Editing: PUT to backend
        const res = await fetch(`/api/products/${initialProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || 'Failed to update product');
        } else {
          const updatedProduct = await res.json();
          if (onSubmit) onSubmit(updatedProduct);
        }
      } else {
        // Adding: POST to backend
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || 'Failed to add product');
        } else {
          const newProduct = await res.json();
          setName('');
          setPrice('');
          setStock('');
          if (onSubmit) onSubmit(newProduct);
        }
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>{initialProduct ? 'Edit Product' : 'Add Product'}</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
          disabled={loading}
        >
          {categories.map(cat => (
            <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          label="Stock"
          type="number"
          value={stock}
          onChange={e => setStock(e.target.value)}
          required
          fullWidth
          sx={{ mb: 2 }}
          disabled={loading}
        />
        {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? (initialProduct ? 'Updating...' : 'Adding...') : (initialProduct ? 'Update Product' : 'Add Product')}
        </Button>
      </form>
    </Paper>
  );
}
