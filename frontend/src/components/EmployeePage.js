import React, { useState } from 'react';
import EmployerLogin from './EmployerLogin';
import ProductForm from './ProductForm';
import CategoryForm from './CategoryForm';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Radio, RadioGroup, FormControlLabel, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OrderList from './OrderList';

function EmployeePage() {
  const [employer, setEmployer] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  // Add category and refresh from backend
  const handleAddCategory = (cat) => {
    // After adding, re-fetch categories from backend
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  };
  const [editProduct, setEditProduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [view, setView] = useState(''); // '', 'products', 'orders'
  // Remove showAddDialog, use 'add' view instead
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch categories and products from backend
  React.useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  // Filter products by selected category
  const filteredProducts = selectedCategory
    ? products.filter(p => {
        const cat = categories.find(c => c.name === selectedCategory);
        return cat && p.categoryId === cat.id;
      })
    : products;

  if (!employer) {
    return <EmployerLogin onLogin={setEmployer} />;
  }

  // Add or update product and refresh from backend
  const handleAddOrUpdate = (product) => {
    // After add or update, re-fetch products from backend
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
    setEditProduct(null);
    setEditDialogOpen(false);
  };


  return (
    <div>
      <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: 2, background: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
          <Button
            variant={view === 'products' ? 'contained' : 'outlined'}
            onClick={() => setView('products')}
            sx={{ minWidth: 130, fontSize: '1rem', height: 40 }}
          >
            Products
          </Button>
          <Button
            variant={view === 'add' ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setView('add')}
            sx={{ minWidth: 130, fontSize: '1rem', height: 40 }}
          >
            Add New
          </Button>
          <Button
            variant={view === 'orders' ? 'contained' : 'outlined'}
            onClick={() => setView('orders')}
            sx={{ minWidth: 130, fontSize: '1rem', height: 40 }}
          >
            Orders
          </Button>
        </Box>
      </Paper>

      {view === 'add' && (
        <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
          <Box sx={{ minWidth: 300 }}>
            <CategoryForm onAdd={handleAddCategory} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <ProductForm
              categories={categories}
              onSubmit={handleAddOrUpdate}
              initialProduct={editProduct}
            />
          </Box>
        </Box>
      )}

  {view === 'products' && (
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Product Categories</Typography>
            <RadioGroup
              orientation="vertical"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <FormControlLabel
                key="all"
                value=""
                control={<Radio />}
                label="All Products"
              />
              {categories.map(cat => (
                <FormControlLabel
                  key={cat.id}
                  value={cat.name}
                  control={<Radio />}
                  label={cat.name}
                />
              ))}
            </RadioGroup>
          </Box>
          <Box sx={{ flex: 1 }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <Paper key={product.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1">{product.name}</Typography>
                      <Typography variant="body2">Category: {categories.find(c => c.id === product.categoryId)?.name || ''}</Typography>
                      <Typography variant="body2">Price: ${Number(product.price).toFixed(2)}</Typography>
                      <Typography variant="body2">Stock: {product.stock}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => { setEditProduct(product); setEditDialogOpen(true); }}>Edit</Button>
      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onClose={() => { setEditDialogOpen(false); setEditProduct(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {editProduct && (
            <ProductForm
              categories={categories}
              onSubmit={handleAddOrUpdate}
              initialProduct={editProduct}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditDialogOpen(false); setEditProduct(null); }}>Cancel</Button>
        </DialogActions>
      </Dialog>
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography>No products available.</Typography>
            )}
          </Box>
        </Box>
      )}

      {view === 'orders' && (
        <>
          <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>All Orders</Typography>
          <OrderList />
        </>
      )}
    </div>
  );
}
export default EmployeePage;
