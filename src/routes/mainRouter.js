const { Router } = require('express')
const { recipeRouter, dietsRouter } = require('./')

const mainRouter = Router()


//* Landing
mainRouter.get('/', (req, res) => {
  return res.json({ status: 'ok', server: 'successfully connected' })
})

//* Routes
mainRouter.use('/recipes', recipeRouter)
mainRouter.use('/diets', dietsRouter)

//* Error Handler
mainRouter.all('*', (req, res) => {
  res.status(404).json({
    sucess: false,
    status: 404,
    error: 'Invalid API Endpoint',
    'valid endpoints':
      [
        '/recipes',
        '/recipes/{id}',
        '/recipes?name="..."',
        '/diets'
      ]
  })
})

//* Export main router
module.exports = mainRouter