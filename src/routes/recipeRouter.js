const { Router } = require('express')
const recipeRouter = Router()
const {
  getApiRecipes,
  getDbRecipes,
  getAllRecipes,
  getRecipeById,
  createNewRecipe,
  deleteRecipeById
} = require('../controllers/RecipeController')

//* Get all recipes and by title

recipeRouter.get('/', async (req, res) => {
  const { title } = req.query
  const allRecipes = await getAllRecipes()

  try {
    let result
    if (title) {
      const recipeByTitle = await allRecipes.filter(rec => rec.title.toLowerCase().includes(title.toLowerCase()) || rec.title.toLowerCase() === title.toLowerCase())
      if (recipeByTitle.length > 0) result = recipeByTitle
      else throw Error(`Title: <${title}> doesn't exist.`)
    }
    else {
      if (allRecipes.length > 0) result = allRecipes
      else throw Error('No recipes found.')
    }
    return res.json(result)
  }

  catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

//* Get recipe by ID
recipeRouter.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const recipeById = await getRecipeById(id)
    return res.json(recipeById)
  }

  catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

//* Create a recipe
recipeRouter.post('/', async (req, res) => {
  const { title, image, summary, healthScore, steps, diets, createdInDb } = req.body

  try {
    const createdRecipe = await createNewRecipe(title, image, summary, healthScore, steps, diets, createdInDb)
    await createdRecipe
    if (await createdRecipe) return res.json({ msg: 'Recipe has been successfully created', response: createdRecipe })
  }

  catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

//* Delete recipe by id
recipeRouter.delete('/delete/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await deleteRecipeById(id)
    return res.json({ msg: result })

  }

  catch (error) {
    return res.status(404).json({ error: error.message })
  }
})

module.exports = recipeRouter