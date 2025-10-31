module.exports = app => {
  const review = require('../controllers/review.controller.js');
  const router = require('express').Router();

  router.post('/reviews', review.create);
  router.get('/reviews', review.findAll);
  router.get('/reviews/product/:productId', review.findByProduct);
  router.delete('/reviews/:id', review.delete);

  app.use('/api', router);
};
