
import React, { useState, useEffect, useRef } from 'react';
import { Grid, Typography, RadioGroup, FormControlLabel, Radio, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Alert, Box } from '@mui/material';
import ProductCard from './ProductCard';
import ReviewList from './ReviewList';




function ProductList() {


  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');
  const [prodLoading, setProdLoading] = useState(false);
  const [prodError, setProdError] = useState('');
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Fetch categories and products from backend
  useEffect(() => {
    setCatLoading(true);
    setCatError('');
    fetch('/api/categories')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCatError('Failed to load categories.'))
      .finally(() => setCatLoading(false));
    // Initially fetch all products
    setProdLoading(true);
    setProdError('');
    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProdError('Failed to load products.'))
      .finally(() => setProdLoading(false));
  }, []);

  // Fetch products when selectedCategory changes
  // Debounce category change
  const debounceTimeout = useRef();
  useEffect(() => {
    setProdLoading(true);
    setProdError('');
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      if (selectedCategory === '' || selectedCategory === null) {
        fetch('/api/products')
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch products');
            return res.json();
          })
          .then(data => setProducts(Array.isArray(data) ? data : []))
          .catch(() => setProdError('Failed to load products.'))
          .finally(() => setProdLoading(false));
      } else {
        fetch(`/api/categories/${selectedCategory}/products`)
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch products');
            return res.json();
          })
          .then(data => setProducts(Array.isArray(data) ? data : []))
          .catch(() => setProdError('Failed to load products.'))
          .finally(() => setProdLoading(false));
      }
      setPage(1); // Reset to first page on category change
    }, 350);
    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line
  }, [selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Pagination handlers
  const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(products.length / pageSize);
  const handlePrevPage = () => setPage(p => Math.max(1, p - 1));
  const handleNextPage = () => setPage(p => Math.min(totalPages, p + 1));

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
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontSize: '1.3rem', ml: { xs: 0, sm: 2, md: 3, lg: 4 }, mb: 2, textAlign: 'left' }}
      >
        Categories
      </Typography>
      {catLoading && <CircularProgress size={22} sx={{ ml: 2, mb: 2 }} />}
      {catError && <Alert severity="error" sx={{ mb: 2 }}>{catError}</Alert>}
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
          {prodLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : prodError ? (
            <Alert severity="error">{prodError}</Alert>
          ) : (
            <>
              <Grid container spacing={2} justifyContent="flex-start" alignItems="flex-start" wrap="wrap">
                {paginatedProducts.map(product => (
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
              {/* Pagination controls */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
                  <Button onClick={handlePrevPage} disabled={page === 1} variant="outlined">Previous</Button>
                  <Typography variant="body2">Page {page} of {totalPages}</Typography>
                  <Button onClick={handleNextPage} disabled={page === totalPages} variant="outlined">Next</Button>
                </Box>
              )}
            </>
          )}
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
