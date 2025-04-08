module.exports = (sequelize, Sequelize) => {
  const Junction = sequelize.define('junction', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_person: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'persons',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    id_car: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'cars',
        key: 'id'
      },
      onDelete: 'CASCADE'
    }
  }, {
    timestamps: true
  });

  return Junction;
}; 