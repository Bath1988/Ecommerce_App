module.exports = app => {
  const order = require('../controllers/order.controller.js');
  const router = require('express').Router();

  router.post('/orders', order.create);
  router.get('/orders', order.findAll);

  app.use('/api', router);
};
