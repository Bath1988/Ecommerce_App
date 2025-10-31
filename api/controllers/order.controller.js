const db = require('../models');
const Order = db.order;
const Product = db.product;

// Create a new order with stock check
exports.create = async (req, res) => {
  try {
    const { customerName, productId, quantity } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock. Available: ${product.stock}` });
    }
    // Subtract quantity from stock
    product.stock -= quantity;
    await product.save();
    const total = product.price * quantity;
    const order = await Order.create({ customerName, productId, quantity, total });
    res.status(201).json({ orderId: order.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders
exports.findAll = async (req, res) => {
  try {
    const orders = await Order.findAll({ include: [{ model: Product }] });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
