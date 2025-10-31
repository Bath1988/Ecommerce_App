const db = require('../models');
const Review = db.review;
const Order = db.order;
const Product = db.product;

// Create a new review, auto-fill itemName from Product
exports.create = async (req, res) => {
  try {
    const { orderId, productId, reviewText, stars } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const itemName = product.name;
    const review = await Review.create({ orderId, productId, itemName, reviewText, stars });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reviews for a product
exports.findByProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.findAll({ where: { productId } });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reviews, optionally filter by stars and productId
exports.findAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.stars) where.stars = req.query.stars;
    if (req.query.productId) where.productId = req.query.productId;
    const reviews = await Review.findAll({ where });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Placeholder for delete review (does nothing for now)
exports.delete = async (req, res) => {
  res.status(501).json({ message: 'Delete review not implemented yet.' });
};
