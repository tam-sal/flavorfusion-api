const axios = require('axios')
const { generateKey } = require('../config/config')
const { Recipe, Diets } = require('../db')

const generatedKey = generateKey()
const limit = 100
const baseUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${generatedKey}&addRecipeInformation=true&number=${limit}`

const formatSignleRecipe = (recipe) => {
  let { diets } = recipe
  //! TODO > Refactor to SET
  if (diets.length) {
    if (recipe.vegetarian) diets = [...diets, 'vegetarian']
    if (recipe.vegan) diets = [...diets, 'vegan']
    if (recipe.glutenFree) diets = [...diets, 'gluten free']
    diets = [...new Set(diets)]
    diets = diets.map(diet => {
      return {
        "name": diet
      }
    })
  }
  else {
    diets = []
  }
  const { analyzedInstructions } = recipe
  const steps = analyzedInstructions[0]?.steps || []
  let stepsCollector = ''
  if (steps.length) {
    for (let i = 0; i < steps.length; i++) {
      let singleStep = steps[i].step
      stepsCollector += `${singleStep}<br />`
    }
  }

  return {
    'id': recipe.id,
    'title': recipe.title,
    'image': recipe.image,
    'summary': recipe.summary,
    'healthScore': recipe.healthScore,
    'steps': stepsCollector,
    'Diets': diets,
    'createdInDb': false
  }
}

const getApiRecipes = async () => {

  try {
    const { data } = await axios.get(baseUrl)
    const { results } = data
    const apiRecipes = results.map(rec => {
      let res = formatSignleRecipe(rec)
      return res
    })
    return apiRecipes
  }

  catch (error) {
    return error.message
  }
}

const getDbRecipes = async () => {

  if (await Recipe.count()) {

    try {
      const dbData = await Recipe.findAll({
        include: {
          model: Diets,
          attributes: ['name'],
          through: {
            attributes: []
          }
        }
      })
      return dbData
    }

    catch (error) {
      return error.message
    }
  }

  return []
}

const getAllRecipes = async () => {

  try {
    const apiRecipes = await getApiRecipes()
    const dbRecipes = await getDbRecipes()
    if (apiRecipes.length && dbRecipes.length) return [...apiRecipes, ...dbRecipes]
    if (dbRecipes.length) return dbRecipes
    return apiRecipes
  }

  catch (error) {
    return error.message
  }
}

const getRecipeById = async (id) => {

  try {
    const allRecipes = await getAllRecipes()
    const recipeById = await allRecipes.find(rec => rec.id == id)
    if (!recipeById) throw new Error(`Recipe ID: <${id}> doesn't exist.`)
    return recipeById
  }

  catch (error) {
    return error.message
  }
}

const createNewRecipe = async (title, image, summary, healthScore, steps, diet, createdInDb) => {
  const newRecipe = await Recipe.create({ title, image, summary, healthScore, steps, diet, createdInDb })
  const addedDietsDb = await Diets.findAll({
    where: {
      name: diet
    }
  })
  await newRecipe.addDiet(addedDietsDb)
  return newRecipe
}



const deleteRecipeById = async (id) => {
  try {

    let allRecipes = await getAllRecipes()
    let recipeToDel = await getRecipeById(id)
    if (recipeToDel.createdInDb) {
      await recipeToDel.destroy()
      allRecipes = await getAllRecipes()
    }
    else allRecipes = await allRecipes.filter(recipe => recipe.id !== recipeToDel.id)
    return `Recipe ID: ${id} has been successfully deleted.`
  }
  catch (error) {
    return error.message
  }
}

const print = async (fn) => {
  const res = await fn()
  console.log(res)
}

module.exports = {
  getApiRecipes,
  getDbRecipes,
  getAllRecipes,
  getRecipeById,
  createNewRecipe,
  deleteRecipeById
}





