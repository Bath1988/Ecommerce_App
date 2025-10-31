import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import ReviewList from './ReviewList';

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!product) return <div>Product not found.</div>;

  return (
    <Card sx={{ maxWidth: 600, margin: '2rem auto' }}>
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography color="textSecondary">Price: ${product.price}</Typography>
        <Typography color="textSecondary">Stock: {product.stock}</Typography>
        <Typography color="textSecondary">Category: {product.categoryId}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>{product.description}</Typography>
      </CardContent>
      <ReviewList productId={product.id} />
    </Card>
  );
}

export default ProductPage;
