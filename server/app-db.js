require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 8080;
const ENV = process.env.NODE_ENV || 'dev';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

// Export Sequelize instance for models
module.exports.sequelize = sequelize;

// Import models
const db = require('./models');

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successfully.');
    
    // Sync all models with database
    await db.sequelize.sync({ force: false, alter: false });
    console.log('Models synchronized with database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// API endpoints
// Persons
app.get('/api/persons', async (req, res) => {
  try {
    const persons = await db.Person.findAll({
      include: {
        model: db.Car,
        through: { attributes: [] }
      }
    });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/persons/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const person = await db.Person.findByPk(id, {
      include: {
        model: db.Car,
        through: { attributes: [] }
      }
    });
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    res.json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/persons', async (req, res) => {
  try {
    const { nume, prenume, cnp, varsta, cars } = req.body;
    
    if (!nume || !prenume || !cnp || !varsta) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const person = await db.Person.create({
      nume,
      prenume,
      cnp,
      varsta
    });
    
    if (cars && cars.length > 0) {
      await person.addCars(cars);
    }
    
    const result = await db.Person.findByPk(person.id, {
      include: {
        model: db.Car,
        through: { attributes: [] }
      }
    });
    
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/persons/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nume, prenume, cnp, varsta, cars } = req.body;
    
    const person = await db.Person.findByPk(id);
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    await person.update({
      nume,
      prenume,
      cnp,
      varsta
    });
    
    if (cars) {
      await person.setCars(cars);
    }
    
    res.json({ message: 'Person updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/persons/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const person = await db.Person.findByPk(id);
    
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    
    await person.destroy();
    
    res.json({ message: 'Person deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cars
app.get('/api/cars', async (req, res) => {
  try {
    const cars = await db.Car.findAll({
      include: {
        model: db.Person,
        through: { attributes: [] }
      }
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const car = await db.Car.findByPk(id, {
      include: {
        model: db.Person,
        through: { attributes: [] }
      }
    });
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    const { marca, model, an_fabricatie, capacitate_cilindrica } = req.body;
    
    if (!marca || !model || !an_fabricatie || !capacitate_cilindrica) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    let taxa_impozit = 50;
    if (capacitate_cilindrica > 2000) {
      taxa_impozit = 200;
    } else if (capacitate_cilindrica >= 1500) {
      taxa_impozit = 100;
    }
    
    const car = await db.Car.create({
      marca,
      model,
      an_fabricatie,
      capacitate_cilindrica,
      taxa_impozit
    });
    
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/cars/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { marca, model, an_fabricatie, capacitate_cilindrica } = req.body;
    
    const car = await db.Car.findByPk(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    let taxa_impozit = 50;
    if (capacitate_cilindrica > 2000) {
      taxa_impozit = 200;
    } else if (capacitate_cilindrica >= 1500) {
      taxa_impozit = 100;
    }
    
    await car.update({
      marca,
      model,
      an_fabricatie,
      capacitate_cilindrica,
      taxa_impozit
    });
    
    res.json({ message: 'Car updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/cars/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const car = await db.Car.findByPk(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    
    await car.destroy();
    
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  await testConnection();
  console.log(`Listening on port: ${PORT}, env: ${ENV}`);
}); 