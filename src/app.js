const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mainRouter = require('./routes/mainRouter')
const { originsOptions } = require('./config/config')

//* Instantiating server
const app = express()


//* Middlewares
app.use(express.json())
app.use(cors(originsOptions))
app.use(morgan('dev'))

//* Main Router
app.use('/', mainRouter)


//* Exporting app
module.exports = app