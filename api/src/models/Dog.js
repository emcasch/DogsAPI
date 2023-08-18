const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dog = sequelize.define('Dog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    searchID: {
      type: DataTypes.INTEGER,
      unique: true,
      defaultValue: 264,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life_span: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    hooks: {
      beforeCreate: async (dog) => {
        const lastDog = await sequelize.models.Dog.findOne({
          order: [['searchID', 'DESC']],
        });
        const lastSearchID = lastDog ? lastDog.searchID : 264;
        dog.searchID = lastSearchID + 1;
      },
    },
  });
};
