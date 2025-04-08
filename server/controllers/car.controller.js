const db = require('../models');
const Car = db.Car;
const Person = db.Person;
const Junction = db.Junction;
const { Op } = db.Sequelize;

// Calculează taxa de impozit
const calculateTax = (capacitate) => {
  if (capacitate < 1500) {
    return 50;
  } else if (capacitate >= 1500 && capacitate <= 2000) {
    return 100;
  } else {
    return 200;
  }
};

// Creare mașină nouă
exports.create = async (req, res) => {
  try {
    const { marca, model, an_fabricatie, capacitate_cilindrica } = req.body;

    if (!marca || !model || !an_fabricatie || !capacitate_cilindrica) {
      return res.status(400).send({
        message: 'Toate câmpurile sunt obligatorii!'
      });
    }

    // Calculează taxa de impozit
    const taxa_impozit = calculateTax(capacitate_cilindrica);

    // Creează mașina
    const car = await Car.create({
      marca,
      model,
      an_fabricatie,
      capacitate_cilindrica,
      taxa_impozit
    });

    return res.status(201).send({
      message: 'Mașina a fost creată cu succes!',
      data: car
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la crearea mașinii.'
    });
  }
};

// Găsește toate mașinile
exports.findAll = async (req, res) => {
  try {
    const cars = await Car.findAll({
      include: [{
        model: Person,
        through: { attributes: [] } // Exclude atributele tabelului de legătură
      }]
    });

    return res.status(200).send(cars);
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la căutarea mașinilor.'
    });
  }
};

// Găsește o mașină după ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const car = await Car.findByPk(id, {
      include: [{
        model: Person,
        through: { attributes: [] }
      }]
    });

    if (!car) {
      return res.status(404).send({
        message: `Mașina cu ID-ul ${id} nu a fost găsită.`
      });
    }

    return res.status(200).send(car);
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la căutarea mașinii.'
    });
  }
};

// Actualizează o mașină
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, model, an_fabricatie, capacitate_cilindrica } = req.body;

    // Verifică dacă mașina există
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).send({
        message: `Mașina cu ID-ul ${id} nu a fost găsită.`
      });
    }

    // Calculează taxa de impozit
    const taxa_impozit = calculateTax(capacitate_cilindrica);

    // Actualizează mașina
    await Car.update({
      marca,
      model,
      an_fabricatie,
      capacitate_cilindrica,
      taxa_impozit
    }, {
      where: { id }
    });

    return res.status(200).send({
      message: 'Mașina a fost actualizată cu succes!'
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la actualizarea mașinii.'
    });
  }
};

// Șterge o mașină
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifică dacă mașina există
    const car = await Car.findByPk(id);
    if (!car) {
      return res.status(404).send({
        message: `Mașina cu ID-ul ${id} nu a fost găsită.`
      });
    }

    // Șterge mașina
    await Car.destroy({
      where: { id }
    });

    return res.status(200).send({
      message: 'Mașina a fost ștearsă cu succes!'
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la ștergerea mașinii.'
    });
  }
}; 