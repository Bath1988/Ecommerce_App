
import React from 'react';
import { List, ListItem, ListItemText, Typography, Rating } from '@mui/material';

function ReviewList({ productId }) {
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(false);


  React.useEffect(() => {
    if (!productId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/reviews/product/${productId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(err => {
        if (err.name !== 'AbortError') setReviews([]);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [productId]);

  if (!productId) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <Typography variant="subtitle1" gutterBottom>Reviews</Typography>
      <List>
        {loading ? (
          <ListItem><ListItemText primary="Loading..." /></ListItem>
        ) : reviews.length === 0 ? (
          <ListItem>
            <ListItemText primary="No reviews for this product." />
          </ListItem>
        ) : reviews.map(review => (
          <ListItem key={review.id}>
            <ListItemText
              primary={review.reviewText || review.comment}
              secondary={<Rating value={review.stars || review.rating} readOnly />}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default ReviewList;
