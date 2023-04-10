const dotenv = require('dotenv')
const { Sequelize } = require('sequelize')
const { RecipeModel, DietsModel } = require('./models')

//* ENV VARS
dotenv.config()
const { DB_USER, DB_PASS, DB_PORT, DB_NAME, DB_HOST } = process.env

//* SEQUELIZE INSTANCE
const database = new Sequelize(
  `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  {
    logging: false,
    native: false,
    dialect: 'postgres'
  }
)

//* MODELS INJECTION - Connect Model to DB and Create its corresponding table
RecipeModel(database)
DietsModel(database)

//* Establish models relationship
const { Recipe, Diets } = database.models
Recipe.belongsToMany(Diets, { through: 'RecType' })
Diets.belongsToMany(Recipe, { through: 'RecType' })

//* Export database and models
module.exports = {
  database,
  ...database.models
}

