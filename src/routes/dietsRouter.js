const { Router } = require('express')
const dietsRouter = Router()
const { getDietsFromDb } = require('../controllers/DietsController')

dietsRouter.get('/', async (req, res) => {

  try {
    const dietsDB = await getDietsFromDb()
    return res.json(dietsDB)
  }

  catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

module.exports = dietsRouter

