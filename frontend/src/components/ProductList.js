
import React, { useState, useEffect } from 'react';
import { Grid, Typography, RadioGroup, FormControlLabel, Radio, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';
import ReviewList from './ReviewList';




function ProductList() {

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch categories and products from backend
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
    // Initially fetch all products
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []));
  }, []);

  // Fetch products when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === '' || selectedCategory === null) {
      // Show all products
      fetch('/api/products')
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : []));
    } else {
      // Fetch products for selected category
      fetch(`/api/categories/${selectedCategory}/products`)
        .then(res => res.json())
        .then(data => setProducts(Array.isArray(data) ? data : []));
    }
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Dialog state for product details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");

  // Open dialog and fetch product details
  const handleViewProduct = async (productId) => {
    setDialogLoading(true);
    setDialogOpen(true);
    setDialogError("");
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) {
        const errText = await res.text();
        setDialogError(`Server error: ${res.status} ${errText}`);
        setDialogProduct(null);
        return;
      }
      const data = await res.json();
      if (!data || !data.id) {
        setDialogError("Product not found or invalid data returned.");
        setDialogProduct(null);
        return;
      }
      setDialogProduct(data);
    } catch (e) {
      setDialogError("Network or server error. See console for details.");
      setDialogProduct(null);
      console.error("Failed to load product details:", e);
    } finally {
      setDialogLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogProduct(null);
    setDialogError("");
  };

  return (
    <div>
      {/* Always left-align the heading, with left margin to match category column */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: '1.3rem', ml: { xs: 0, sm: 2, md: 3, lg: 4 }, mb: 2, textAlign: 'left' }}
      >
        Categories
      </Typography>
  <Grid container spacing={2} direction="row" justifyContent="flex-start" alignItems="flex-start" wrap="nowrap" sx={{ minHeight: 400, paddingLeft: 2, paddingRight: 2 }}>
        <Grid item xs={12} sm={4} md={3} lg={2} sx={{ minWidth: 180, maxWidth: 260 }}>
          <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
            <FormControlLabel
              key="all"
              value=""
              control={<Radio />}
              label="Show All Products"
            />
            {categories.map(category => (
              <FormControlLabel
                key={category.id}
                value={String(category.id)}
                control={<Radio />}
                label={category.name}
              />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12} sm={8} md={9} lg={10} sx={{ pl: { xs: 0, sm: 2 }, pr: { xs: 0, sm: 2 } }}>
          <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-start" wrap="wrap">
            {(Array.isArray(products) ? products : []).map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}>
                <ProductCard
                  product={{
                    ...product,
                  }}
                  onView={() => handleViewProduct(product.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      {/* Product Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {dialogLoading ? (
            <CircularProgress />
          ) : dialogProduct ? (
            <>
              <Typography variant="h6" gutterBottom>{dialogProduct.name}</Typography>
              <Typography color="textSecondary">Price: ${dialogProduct.price}</Typography>
              <Typography color="textSecondary">Stock: {dialogProduct.stock}</Typography>
              <Typography color="textSecondary">Category: {dialogProduct.categoryId}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>{dialogProduct.description}</Typography>
              {dialogProduct && dialogProduct.id && (
                <ReviewList productId={dialogProduct.id} />
              )}
            </>
          ) : (
            <>
              {dialogOpen && !dialogLoading && dialogProduct === null && dialogError && (
                <>
                  <Typography color="error">Failed to load product details.</Typography>
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>{dialogError}</Typography>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProductList;
