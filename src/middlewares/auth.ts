import { Request, Response, NextFunction } from 'express'
import jwt from '../helpers/jwt'

interface IToken {
  name: string;
  password: string;
}

function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.headers.authorization) {
    const [bearer, access_token] = req.headers.authorization.split(' ')
    const decoded = jwt.checkToken(access_token) as IToken

    if(decoded.password === process.env.ADMIN_PASSWORD) {
      next()
    }
  } else {
    throw {
      name: 'error jwt',
      details: 'jwt token missing'
    }
  }  
}

export default authenticate