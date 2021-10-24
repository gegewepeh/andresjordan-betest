if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.JWT_SECRET_KEY

function generateToken (payload: object) {
  const token = jwt.sign (payload , SECRET_KEY as string, { expiresIn: '1h' })
  return token
}

function checkToken (token: any) {
  const decoded = jwt.verify(token, SECRET_KEY as string)
  return decoded
}

export default {
  generateToken, 
  checkToken
}
