module.exports = (app) => {
  const cars = require('../controllers/car.controller');
  const router = require('express').Router();

  // Creare mașină nouă
  router.post('/', cars.create);

  // Obține toate mașinile
  router.get('/', cars.findAll);

  // Obține o mașină după ID
  router.get('/:id', cars.findOne);

  // Actualizează o mașină
  router.put('/:id', cars.update);

  // Șterge o mașină
  router.delete('/:id', cars.delete);

  app.use('/api/cars', router);
}; 