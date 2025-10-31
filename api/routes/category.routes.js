module.exports = app => {
  const category = require('../controllers/category.controller.js');
  const router = require('express').Router();

  router.post('/categories', category.create);
  router.get('/categories', category.findAll);
  router.get('/categories/:id', category.findOne);
  router.delete('/categories/:id', category.delete);
  router.get('/categories/:id/products', category.listProducts);

  app.use('/api', router);
};
