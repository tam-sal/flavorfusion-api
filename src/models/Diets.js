const { DataTypes } = require('sequelize')

const Diets = (database) => {
  database.define('Diets', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  },
    {
      timestamps: false,
      freezeTableName: true
    })
}

module.exports = Diets