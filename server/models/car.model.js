module.exports = (sequelize, Sequelize) => {
  const Car = sequelize.define('car', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    marca: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    model: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    an_fabricatie: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    capacitate_cilindrica: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    taxa_impozit: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: (car) => {
        car.taxa_impozit = calculateTax(car.capacitate_cilindrica);
      },
      beforeUpdate: (car) => {
        car.taxa_impozit = calculateTax(car.capacitate_cilindrica);
      }
    }
  });

  function calculateTax(capacitate) {
    if (capacitate < 1500) {
      return 50;
    } else if (capacitate >= 1500 && capacitate <= 2000) {
      return 100;
    } else {
      return 200;
    }
  }

  return Car;
}; 