const { Sequelize } = require('sequelize');
const { sequelize } = require('../app');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Person = require('./person.model')(sequelize, Sequelize);
db.Car = require('./car.model')(sequelize, Sequelize);
db.Junction = require('./junction.model')(sequelize, Sequelize);

// Relații
db.Person.belongsToMany(db.Car, {
  through: db.Junction,
  foreignKey: 'id_person',
  otherKey: 'id_car'
});

db.Car.belongsToMany(db.Person, {
  through: db.Junction,
  foreignKey: 'id_car',
  otherKey: 'id_person'
});

// Comentăm sincronizarea aici pentru a evita duplicate
// db.sequelize.sync({ alter: true })
//   .then(() => {
//     console.log('Database synchronized');
//   })
//   .catch(err => {
//     console.error('Failed to sync database:', err);
//   });

module.exports = db; 