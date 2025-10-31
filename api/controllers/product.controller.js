const db = require('../models');
const Product = db.product;
const Review = db.review;
const Sequelize = db.Sequelize;

// Create a new product
exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products, optionally filter by categoryId, with reviews, sorted by stars (desc)
exports.findAll = async (req, res) => {
  try {
    const where = req.query.categoryId ? { categoryId: req.query.categoryId } : {};
    const products = await Product.findAll({
      where,
      include: [{
        model: Review,
        required: false
      }],
      order: [[Sequelize.literal('(SELECT AVG(stars) FROM review WHERE review."productId" = product.id)'), 'DESC']]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get one product by id with reviews
exports.findOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Review }]
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
exports.update = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
exports.delete = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
