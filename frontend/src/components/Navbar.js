import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Typography, Button, Paper, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CartDrawer from './CartDrawer';
import { useCart } from './CartContext';


const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Customer Portal', to: '/customer' },
    { label: 'Employee Portal', to: '/employee' },
];


function Navbar() {
    const { cart } = useCart();
    const [cartOpen, setCartOpen] = React.useState(false);
    const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const location = useLocation();
    return (
        <Paper elevation={2} sx={{ mb: 2, borderRadius: 0 }}>
            <Box sx={{ width: '100%', px: '2cm', boxSizing: 'border-box' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                                    <img src="https://img.icons8.com/color/96/000000/shopping-cart.png" alt="logo" style={{ height: 48, marginRight: 16 }} />
                                    <Typography
                                        variant="h3"
                                        sx={{
                                            fontWeight: 'bold',
                                            letterSpacing: 2,
                                            color: '#1976d2',
                                            textShadow: '0 2px 8px rgba(25,118,210,0.08)',
                                            fontFamily: 'Segoe UI, Arial, sans-serif',
                                        }}
                                    >
                                        Product Sales App
                                    </Typography>
                                </Box>
                <Box component="nav" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap', pb: 2, alignItems: 'center' }}>
                    {navLinks.map((link, index) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Button
                                key={link.to}
                                component={Link}
                                to={link.to}
                                size="small"
                                variant={isActive ? 'contained' : 'outlined'}
                                color={isActive ? 'primary' : 'inherit'}
                                sx={{ minWidth: 0, px: 1.5, fontSize: '0.95rem', borderRadius: 2 }}
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                    <IconButton color="primary" sx={{ ml: 2 }} onClick={() => setCartOpen(true)}>
                        <Badge badgeContent={cartCount} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
                </Box>
            </Box>
        </Paper>
    );
}

export default Navbar;