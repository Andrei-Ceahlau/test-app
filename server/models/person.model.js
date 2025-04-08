module.exports = (sequelize, Sequelize) => {
  const Person = sequelize.define('person', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nume: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    prenume: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    cnp: {
      type: Sequelize.STRING(13),
      allowNull: false,
      unique: true
    },
    varsta: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return Person;
}; 