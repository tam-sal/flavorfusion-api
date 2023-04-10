const axios = require('axios')
const { generateKey } = require('../config/config')
const { Diets } = require('../db')

const apiKey = generateKey()
const baseURL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&addRecipeInformation=true&number=100`

const getDietsApi = async () => {

  try {
    const { data } = await axios.get(baseURL)
    const { results } = data
    let allDiets = []
    let diets = []
    results.map((res) => {
      if (res.vegetarian) allDiets.push('vegetarian')
      if (res.vegan) allDiets.push('vegan')
      if (res.glutenFree) allDiets.push('gluten free')
      allDiets = allDiets.concat(...res.diets)
      allDiets.forEach(diet => {
        if (!diets.includes(diet)) diets.push(diet)
      })
    })
    diets = diets.map(diet => {
      return { 'name': diet }
    })
    return diets
  }

  catch (error) {
    console.log(error.message)
  }
}


const getDietsFromDb = async () => {
  if (await Diets.count() === 0) {
    const dietsFromApi = await getDietsApi()
    await Diets.bulkCreate(dietsFromApi)
    return await Diets.findAll()
  }
  else return await Diets.findAll()
}

module.exports = { getDietsFromDb }


