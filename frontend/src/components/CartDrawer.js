import React from 'react';
import { Drawer, Box, Typography, IconButton, Button, Divider, TextField, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from './CartContext';


export default function CartDrawer({ open, onClose }) {
  const { cart, dispatch } = useCart();
  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [customerName, setCustomerName] = React.useState('');

  // Store review info for user after checkout
  const [reviewInfo, setReviewInfo] = React.useState([]);

  const handleCheckout = async () => {
    setError('');
    setSuccess(false);
    setReviewInfo([]);
    if (!customerName.trim()) {
      setError('Please enter your name to checkout.');
      return;
    }
    setLoading(true);
    try {
      const reviewData = [];
      for (const { product, quantity } of cart.items) {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerName: customerName.trim(), productId: product.id, quantity })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || 'Order failed');
        }
  const data = await res.json();
  // Backend returns { orderId: ... }
  reviewData.push({ productId: product.id, orderId: data.orderId, productName: product.name });
      }
      setSuccess(true);
      setReviewInfo(reviewData);
      dispatch({ type: 'CLEAR_CART' });
      setCustomerName('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 340, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Cart</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {cart.items.length === 0 && reviewInfo.length === 0 && (
          <Typography variant="body1">Your cart is empty.</Typography>
        )}
        {cart.items.length > 0 && (
          <>
            {cart.items.map(({ product, quantity }) => (
              <Box key={product.id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{product.name}</Typography>
                <Typography variant="body2">Price: ${product.price} x {quantity}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Button size="small" onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: product.id, quantity: quantity - 1 })} disabled={quantity <= 1}>-</Button>
                  <Typography sx={{ mx: 1 }}>{quantity}</Typography>
                  <Button size="small" onClick={() => dispatch({ type: 'UPDATE_QUANTITY', productId: product.id, quantity: quantity + 1 })}>+</Button>
                  <Button size="small" color="error" onClick={() => dispatch({ type: 'REMOVE_FROM_CART', productId: product.id })} sx={{ ml: 2 }}>Remove</Button>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Total: ${total.toFixed(2)}</Typography>
            <Box sx={{ mt: 2, mb: 1 }}>
              <TextField
                label="Your Name"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                fullWidth
                disabled={loading}
                variant="outlined"
                size="small"
                required
              />
            </Box>
            {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 1, position: 'relative' }}
              onClick={handleCheckout}
              disabled={loading || cart.items.length === 0}
            >
              {loading ? (
                <>
                  <CircularProgress size={22} sx={{ color: 'white', mr: 1 }} /> Processing...
                </>
              ) : 'Checkout'}
            </Button>
          </>
        )}
        {success && reviewInfo.length > 0 && (
          <Box sx={{ mt: 2, mb: 1, p: 1, background: '#e3f2fd', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1976d2' }}>
              Use the following Product ID and Order ID to leave a review:
            </Typography>
            {reviewInfo.map(info => (
              <Typography key={info.productId + '-' + info.orderId} variant="body2" sx={{ color: '#333', ml: 1 }}>
                Product: <b>{info.productName}</b> &nbsp;|&nbsp; Product ID: <b>{info.productId}</b> &nbsp;|&nbsp; Order ID: <b>{info.orderId}</b>
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
