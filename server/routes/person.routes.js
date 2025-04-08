module.exports = (app) => {
  const persons = require('../controllers/person.controller');
  const router = require('express').Router();

  // Creare persoană nouă
  router.post('/', persons.create);

  // Obține toate persoanele
  router.get('/', persons.findAll);

  // Obține o persoană după ID
  router.get('/:id', persons.findOne);

  // Actualizează o persoană
  router.put('/:id', persons.update);

  // Șterge o persoană
  router.delete('/:id', persons.delete);

  app.use('/api/persons', router);
}; 