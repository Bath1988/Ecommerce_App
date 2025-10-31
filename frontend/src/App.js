import CustomerPage from './components/CustomerPage';
import EmployeePage from './components/EmployeePage';

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import HomePage from './components/HomePage';
import OrderList from './components/OrderList';
import ProductPage from './components/ProductPage';
import { CartProvider } from './components/CartContext';

function App() {
    return (
        <CartProvider>
            <Router>
                <Navbar />
                <div className="App">
                    <main style={{ marginLeft: '2cm', marginRight: '2cm' }}>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/customer" element={<CustomerPage />} />
                            <Route path="/employee" element={<EmployeePage />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;