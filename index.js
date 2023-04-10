const server = require('./src/app')
const { database } = require('./src/db')
const dotenv = require('dotenv')

dotenv.config()

const serverPort = process.env.APP_PORT || 3030

server.listen(serverPort, async () => {
  await database.sync()
    .then(() => console.log('server listening on port', serverPort))
    .catch(err => console.error(err.message))
})