

import React, { useState } from 'react';
import { Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Rating, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProductList from './ProductList';


function CustomerPage() {
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  // Review form state
  const [productId, setProductId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [itemName, setItemName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState(0);
  const [products, setProducts] = useState([]);

  // Fetch products for dropdown
  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []));
  }, []);

  const handleAddReview = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setProductId('');
    setOrderId('');
    setItemName('');
    setReviewText('');
    setStars(0);
  };

  const [submitStatus, setSubmitStatus] = useState(null); // null | 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitMessage('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: Number(orderId),
          productId: Number(productId),
          reviewText,
          stars: Number(stars)
        })
      });
      if (res.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Review submitted successfully!');
        handleDialogClose();
      } else {
        const data = await res.json();
        setSubmitStatus('error');
        setSubmitMessage(data.message || 'Failed to submit review.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('Failed to submit review.');
    }
  };

  return (
    <Box sx={{ p: 2, position: 'relative' }}>
  <Box sx={{ position: 'absolute', top: 24, right: 24, zIndex: 10 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddReview}
          sx={{
            borderRadius: 2,
            minWidth: 120,
            minHeight: 48,
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: 2,
            textTransform: 'none',
            backgroundColor: 'white',
            color: '#1976d2',
            border: '1px solid #1976d2',
            '&:hover': { backgroundColor: '#e3f2fd' }
          }}
        >
          Add Review
        </Button>
      </Box>
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2, background: '#f8f9fa' }}>
        <ProductList />
      </Paper>
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>Add Product Review</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Product ID"
              value={productId}
              onChange={e => setProductId(e.target.value)}
              required
              type="number"
            />
            <TextField
              label="Order ID"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              required
              type="number"
            />
            <TextField
              label="Review"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              required
              multiline
              minRows={2}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Stars:</Typography>
              <Rating
                value={stars}
                onChange={(_, newValue) => setStars(newValue)}
                max={5}
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button type="submit" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Show submit status message */}
      {submitStatus && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}>
          <Paper elevation={4} sx={{ p: 2, background: submitStatus === 'success' ? '#e8f5e9' : '#ffebee', color: submitStatus === 'success' ? '#388e3c' : '#d32f2f' }}>
            {submitMessage}
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default CustomerPage;
