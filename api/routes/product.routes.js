module.exports = app => {
  const product = require('../controllers/product.controller.js');
  const router = require('express').Router();

  router.post('/products', product.create);
  router.get('/products', product.findAll);
  router.get('/products/:id', product.findOne);
  router.put('/products/:id', product.update);
  router.delete('/products/:id', product.delete);

  app.use('/api', router);
};
