
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ChatBox from './ChatBox';

export default function HomePage() {
  return (
    <Box sx={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #e3f2fd 0%, #fff 100%)',
      borderRadius: 4,
      boxShadow: 3,
      p: 4,
      mt: 4
    }}>
      <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
        Welcome to Product Sales App
      </Typography>
      <Typography variant="h5" sx={{ mb: 3, color: '#333' }}>
        Discover, review, and manage products with ease.
      </Typography>

      <img 
        src="/images/image.png" 
        alt="Shopping" 
        style={{
          maxWidth: '350px',
          width: '100%',
          height: 'auto',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 16px rgba(25, 118, 210, 0.08)'
        }}
      />
      <Typography variant="body1" sx={{ mb: 4, color: '#555', maxWidth: 600, textAlign: 'center' }}>
        Browse our wide range of products, read real customer reviews, and manage your orders. Whether you're a customer looking for the best deals or an employee managing inventory, our app makes it simple and beautiful.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button href="/customer" variant="contained" color="primary" size="large">Customer Portal</Button>
        <Button href="/employee" variant="outlined" color="primary" size="large">Employee Portal</Button>
      </Box>
      <Box sx={{ maxWidth: 600, textAlign: 'center', background: '#f1f8e9', borderRadius: 3, p: 3, boxShadow: 1, mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#388e3c', mb: 1 }}>
          About the Employee Portal
        </Typography>
        <Typography variant="body1" sx={{ color: '#333' }}>
          The Employee Portal is for company staff who manage warehouse inventory and product stocks. Access is restricted to authorized employees only. You will need a company-provided Secret ID and password to log in and manage products, categories, and orders securely.
        </Typography>
      </Box>

      {/* Chat Box Section */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
        <ChatBox />
      </Box>
    </Box>
  );
}
