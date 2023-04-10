require('dotenv').config()

const { kA, kB, kC, kD, kE, kF, kG, kH, kI, kJ } = process.env
const keys = [kA, kB, kC, kD, kE, kF, kG, kH, kI, kJ]

const { cors_origin } = process.env



const generateKey = () => {
  const idx = Math.floor(Math.random() * keys.length)
  return keys[idx]
}


const originsOptions = { origin: cors_origin }

module.exports = { generateKey, originsOptions }
