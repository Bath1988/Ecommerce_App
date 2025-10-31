import React from 'react';

import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, onView }) {
  const { dispatch } = useCart();
  return (
    <Card sx={{ cursor: 'pointer', minHeight: 260, maxHeight: 260, minWidth: 220, maxWidth: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', margin: 'auto' }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
  <Typography color="textSecondary">Price: ${Number(product.price).toFixed(2)}</Typography>
        <Typography color="textSecondary">Stock: {product.stock}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" color="primary" onClick={onView}>
          View
        </Button>
        <Button size="small" variant="outlined" onClick={() => dispatch({ type: 'ADD_TO_CART', product })}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard;
