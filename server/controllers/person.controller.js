const db = require('../models');
const Person = db.Person;
const Car = db.Car;
const Junction = db.Junction;
const { Op } = db.Sequelize;

// Creare persoană nouă
exports.create = async (req, res) => {
  try {
    const { nume, prenume, cnp, varsta, cars } = req.body;

    if (!nume || !prenume || !cnp || !varsta) {
      return res.status(400).send({
        message: 'Toate câmpurile sunt obligatorii!'
      });
    }

    // Creează persoana
    const person = await Person.create({
      nume,
      prenume,
      cnp,
      varsta
    });

    // Dacă există mașini selectate, adaugă-le la persoană
    if (cars && cars.length > 0) {
      await person.addCars(cars);
    }

    return res.status(201).send({
      message: 'Persoana a fost creată cu succes!',
      data: person
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la crearea persoanei.'
    });
  }
};

// Găsește toate persoanele
exports.findAll = async (req, res) => {
  try {
    const persons = await Person.findAll({
      include: [{
        model: Car,
        through: { attributes: [] } // Exclude atributele tabelului de legătură
      }]
    });

    return res.status(200).send(persons);
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la căutarea persoanelor.'
    });
  }
};

// Găsește o persoană după ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id, {
      include: [{
        model: Car,
        through: { attributes: [] }
      }]
    });

    if (!person) {
      return res.status(404).send({
        message: `Persoana cu ID-ul ${id} nu a fost găsită.`
      });
    }

    return res.status(200).send(person);
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la căutarea persoanei.'
    });
  }
};

// Actualizează o persoană
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nume, prenume, cnp, varsta, cars } = req.body;

    // Verifică dacă persoana există
    const person = await Person.findByPk(id);
    if (!person) {
      return res.status(404).send({
        message: `Persoana cu ID-ul ${id} nu a fost găsită.`
      });
    }

    // Actualizează persoana
    await Person.update({
      nume,
      prenume,
      cnp,
      varsta
    }, {
      where: { id }
    });

    // Actualizează relațiile cu mașinile
    if (cars !== undefined) {
      // Elimină toate relațiile existente
      await Junction.destroy({
        where: { id_person: id }
      });

      // Adaugă noile relații
      if (cars && cars.length > 0) {
        const personUpdated = await Person.findByPk(id);
        await personUpdated.addCars(cars);
      }
    }

    return res.status(200).send({
      message: 'Persoana a fost actualizată cu succes!'
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la actualizarea persoanei.'
    });
  }
};

// Șterge o persoană
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifică dacă persoana există
    const person = await Person.findByPk(id);
    if (!person) {
      return res.status(404).send({
        message: `Persoana cu ID-ul ${id} nu a fost găsită.`
      });
    }

    // Șterge persoana
    await Person.destroy({
      where: { id }
    });

    return res.status(200).send({
      message: 'Persoana a fost ștearsă cu succes!'
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message || 'A apărut o eroare la ștergerea persoanei.'
    });
  }
}; 